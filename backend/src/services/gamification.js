// Lógica de streak, XP e conquistas — o coração da motivação da plataforma.

const db = require('../db');

const XP_PER_CHALLENGE = 50;

/**
 * Chamado quando o usuário completa o desafio do dia.
 * Atualiza XP, streak (quebra se pulou um dia), e verifica conquistas.
 */
function completeSession(userId, sessionDate) {
  const progress = db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId)
    || { user_id: userId, xp: 0, current_streak: 0, best_streak: 0, last_completed_date: null, modules_completed: 0 };

  const today = new Date(sessionDate);
  const last = progress.last_completed_date ? new Date(progress.last_completed_date) : null;

  let newStreak = 1;
  if (last) {
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) newStreak = progress.current_streak + 1;      // dia seguinte, streak sobe
    else if (diffDays === 0) newStreak = progress.current_streak;     // mesmo dia, mantém
    // diffDays > 1 → quebrou o streak, volta pra 1
  }

  const newXp = progress.xp + XP_PER_CHALLENGE;
  const newBest = Math.max(progress.best_streak, newStreak);

  db.prepare(`
    INSERT INTO progress (user_id, xp, current_streak, best_streak, last_completed_date, modules_completed)
    VALUES (@user_id, @xp, @current_streak, @best_streak, @last_completed_date, @modules_completed)
    ON CONFLICT(user_id) DO UPDATE SET
      xp = @xp, current_streak = @current_streak, best_streak = @best_streak,
      last_completed_date = @last_completed_date, modules_completed = @modules_completed
  `).run({
    user_id: userId,
    xp: newXp,
    current_streak: newStreak,
    best_streak: newBest,
    last_completed_date: sessionDate,
    modules_completed: progress.modules_completed,
  });

  return { xp: newXp, streak: newStreak, bestStreak: newBest };
}

function grantAchievement(userId, title) {
  db.prepare('INSERT INTO achievements (user_id, title) VALUES (?, ?)').run(userId, title);
}

function getUserProgress(userId) {
  return db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId);
}

module.exports = { completeSession, grantAchievement, getUserProgress };
