// Conexão simples com SQLite pra desenvolvimento.
// Trocar por 'pg' (node-postgres) quando for pra produção — as queries
// abaixo usam SQL padrão o suficiente pra migrar sem muita dor.

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/websec.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// roda o schema na primeira vez
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
