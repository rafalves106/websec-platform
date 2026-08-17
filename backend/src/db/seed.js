// Popula o banco com o curso de Web Security e os módulos do mês 1.
// Rodar com: node src/db/seed.js

const db = require('./index');

const course = db.prepare(`
  INSERT OR IGNORE INTO courses (slug, title, description, duration_weeks)
  VALUES ('web-security', 'Web & Mobile Security', 'Trilha de 3 meses do zero ao básico sólido em segurança de aplicações', 12)
`).run();

const courseRow = db.prepare("SELECT id FROM courses WHERE slug = 'web-security'").get();

const modulesMes1 = [
  { week: 1, order: 1, title: 'Como a web funciona por baixo dos panos', summary: 'HTTP, cookies, sessões, headers de segurança' },
  { week: 1, order: 2, title: 'Introdução a ameaças web', summary: 'OWASP Top 10, mentalidade de atacante vs defensor' },
  { week: 2, order: 1, title: 'SQL Injection', summary: 'Como funciona, como explorar em ambiente controlado, como corrigir' },
  { week: 2, order: 2, title: 'Cross-Site Scripting (XSS)', summary: 'Refletido, armazenado e DOM-based' },
  { week: 3, order: 1, title: 'Cross-Site Request Forgery (CSRF)', summary: 'Como um site malicioso força ações em outro' },
  { week: 3, order: 2, title: 'Segurança de APIs REST', summary: 'Exposição de dados, rate limiting, validação de entrada' },
  { week: 4, order: 1, title: 'Projeto do mês: relatório de vulnerabilidades', summary: 'Aplicar tudo em um app vulnerável de propósito (ex: DVWA) e documentar como um pentest' },
];

const insertModule = db.prepare(`
  INSERT INTO modules (course_id, title, week_number, order_index, summary)
  VALUES (?, ?, ?, ?, ?)
`);

for (const m of modulesMes1) {
  const exists = db.prepare('SELECT id FROM modules WHERE course_id = ? AND title = ?').get(courseRow.id, m.title);
  if (!exists) insertModule.run(courseRow.id, m.title, m.week, m.order, m.summary);
}

// usuário de teste — ajuste com seus dados reais
const userExists = db.prepare('SELECT id FROM users WHERE whatsapp_number = ?').get('5531900000000@c.us');
if (!userExists) {
  db.prepare(`
    INSERT INTO users (name, whatsapp_number, github_username, preferred_analogy)
    VALUES ('Falves', '5531900000000@c.us', 'seu-usuario-github', 'moto')
  `).run();
}

console.log('Seed concluído: curso Web Security + módulos do mês 1 + usuário de teste.');
