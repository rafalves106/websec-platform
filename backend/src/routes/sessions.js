const express = require('express');
const db = require('../db');
const { generateDailySession } = require('../services/grok');
const { ensureModuleRepo, commitChallengeSolution } = require('../services/github');
const { completeSession, getUserProgress } = require('../services/gamification');

const router = express.Router();

// GET /api/sessions/today?userId=1
// Busca (ou gera, se ainda não existir) a sessão do dia.
router.get('/today', async (req, res) => {
  const { userId } = req.query;
  const today = new Date().toISOString().slice(0, 10);

  let session = db.prepare(
    'SELECT * FROM daily_sessions WHERE user_id = ? AND session_date = ?'
  ).get(userId, today);

  if (!session) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const module = getNextModuleForUser(userId);

    const generated = await generateDailySession({
      moduleTitle: module.title,
      topic: module.summary,
      analogy: user.preferred_analogy,
      userLevel: 'iniciante',
    });

    const result = db.prepare(`
      INSERT INTO daily_sessions (user_id, module_id, session_date, title, explanation, code_example, challenge, success_criteria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId, module.id, today,
      generated.title, generated.explanation,
      JSON.stringify({ vulnerable: generated.vulnerable_code, fixed: generated.fixed_code }),
      generated.challenge, generated.success_criteria
    );

    session = db.prepare('SELECT * FROM daily_sessions WHERE id = ?').get(result.lastInsertRowid);
  }

  res.json(session);
});

// POST /api/sessions/:id/complete
// Marca a sessão como concluída, sobe pro GitHub, atualiza streak/XP.
router.post('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { solutionCode } = req.body;

  const session = db.prepare('SELECT * FROM daily_sessions WHERE id = ?').get(id);
  if (!session) return res.status(404).json({ error: 'Sessão não encontrada' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
  const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(session.module_id);
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(module.course_id);

  // sobe a solução pro GitHub
  const repo = await ensureModuleRepo({
    userToken: user.github_token,
    owner: user.github_username,
    moduleTitle: module.title,
    courseSlug: course.slug,
  });

  await commitChallengeSolution({
    userToken: user.github_token,
    owner: user.github_username,
    repoName: repo.name,
    filePath: `dia-${session.session_date}/solucao.md`,
    content: `# ${session.title}\n\n${session.challenge}\n\n## Solução\n\n${solutionCode}`,
    message: `Desafio resolvido: ${session.title}`,
  });

  db.prepare(`UPDATE daily_sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`).run(id);
  db.prepare('INSERT INTO repo_links (user_id, module_id, repo_name, repo_url) VALUES (?, ?, ?, ?)')
    .run(user.id, module.id, repo.name, repo.html_url);

  const gamificationResult = completeSession(user.id, session.session_date);

  res.json({ ok: true, repoUrl: repo.html_url, ...gamificationResult });
});

// GET /api/sessions/progress?userId=1
router.get('/progress', (req, res) => {
  const { userId } = req.query;
  res.json(getUserProgress(userId));
});

function getNextModuleForUser(userId) {
  // MVP simples: pega o próximo módulo que o usuário ainda não completou.
  // Depois pode evoluir pra considerar desempenho, dias pulados, etc.
  return db.prepare(`
    SELECT m.* FROM modules m
    WHERE m.id NOT IN (
      SELECT module_id FROM daily_sessions WHERE user_id = ? AND status = 'completed'
    )
    ORDER BY m.week_number, m.order_index
    LIMIT 1
  `).get(userId);
}

module.exports = router;
