import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize Database Schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    userId TEXT PRIMARY KEY,
    personal TEXT,
    education TEXT,
    skills TEXT,
    experience TEXT,
    certs TEXT,
    projects TEXT,
    behavioral TEXT,
    career TEXT,
    score INTEGER DEFAULT 0,
    completionPct INTEGER DEFAULT 0
  )`);
  
  // Create default HR Admin if none exists
  db.get("SELECT id FROM users WHERE email = 'admin@peopleiq.io'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (id, name, email, password, role) VALUES ('hr_admin_1', 'Sarah Admin', 'admin@peopleiq.io', 'admin123', 'hr')");
    }
  });

  // Check if score column exists, if not add it (for existing databases)
  db.all("PRAGMA table_info(profiles)", (err, columns) => {
    if (err) return;
    const hasScore = columns.some(col => col.name === 'score');
    if (!hasScore) {
      db.run("ALTER TABLE profiles ADD COLUMN score INTEGER DEFAULT 0");
    }
  });
});

export default db;
