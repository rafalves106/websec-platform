-- Schema inicial — SQLite para dev, migra pra Postgres depois sem grandes mudanças

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  whatsapp_number TEXT UNIQUE NOT NULL,
  github_username TEXT,
  github_token TEXT,
  preferred_analogy TEXT DEFAULT 'moto', -- moto, jdm, violao, academia...
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL, -- ex: 'web-security'
  title TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER DEFAULT 12
);

CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  title TEXT NOT NULL,        -- ex: 'Injeção SQL'
  week_number INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS daily_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  module_id INTEGER NOT NULL REFERENCES modules(id),
  session_date DATE NOT NULL,
  title TEXT,
  explanation TEXT,           -- gerado pelo Grok
  code_example TEXT,          -- gerado pelo Grok
  challenge TEXT,              -- desafio prático gerado pelo Grok
  success_criteria TEXT,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  completed_at DATETIME,
  UNIQUE(user_id, session_date)
);

CREATE TABLE IF NOT EXISTS progress (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  modules_completed INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,        -- ex: 'Domou o SQL Injection'
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repo_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  module_id INTEGER REFERENCES modules(id),
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
