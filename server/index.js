import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
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
    completionPct INTEGER DEFAULT 0
  )`);
  
  // Create default HR Admin if none exists
  db.get("SELECT id FROM users WHERE email = 'admin@peopleiq.io'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (id, name, email, password, role) VALUES ('hr_admin_1', 'Sarah Admin', 'admin@peopleiq.io', 'admin123', 'hr')");
    }
  });
});

const calculateCompletion = (profile) => {
  const sections = ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'];
  let filled = 0;
  sections.forEach(s => {
    if (profile[s] && profile[s] !== 'null' && profile[s] !== '[]' && profile[s] !== '{}') filled++;
  });
  return Math.round((filled / 8) * 100);
};

// ─── AUTH ENDPOINTS ───
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  const id = 'emp_' + Math.random().toString(36).substr(2, 9);
  
  db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [id, name, email, password, role || 'employee'], function(err) {
    if (err) return res.status(400).json({ error: 'Email likely already exists' });
    
    // Create empty profile
    if (role !== 'hr') {
      db.run('INSERT INTO profiles (userId) VALUES (?)', [id]);
    }
    
    res.json({ user: { id, name, email, role } });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const loginId = typeof email === 'string' ? email.trim() : email;
  
  db.get('SELECT id, name, email, role FROM users WHERE (email = ? OR id = ?) AND password = ?', [loginId, loginId, password], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: row });
  });
});

// ─── PROFILE ENDPOINTS (Employee) ───
app.get('/api/profile/:userId', (req, res) => {
  db.get('SELECT * FROM profiles WHERE userId = ?', [req.params.userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    
    // Parse JSON strings back to objects
    const profile = {};
    for (let key in row) {
      if (key !== 'userId' && key !== 'completionPct') {
        try { profile[key] = JSON.parse(row[key]); } catch(e) { profile[key] = row[key]; }
      } else {
        profile[key] = row[key];
      }
    }
    res.json(profile);
  });
});

app.post('/api/profile/:userId/:section', (req, res) => {
  const { userId, section } = req.params;
  const data = JSON.stringify(req.body);
  
  // Allowed sections
  const valid = ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'];
  if (!valid.includes(section)) return res.status(400).json({ error: 'Invalid section' });
  
  db.run(`UPDATE profiles SET ${section} = ? WHERE userId = ?`, [data, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Recalculate completion
    db.get('SELECT * FROM profiles WHERE userId = ?', [userId], (err, row) => {
      const pct = calculateCompletion(row);
      db.run('UPDATE profiles SET completionPct = ? WHERE userId = ?', [pct, userId]);
      res.json({ success: true, completionPct: pct });
    });
  });
});

// ─── ADMIN ENDPOINTS (HR) ───
app.get('/api/admin/employees', (req, res) => {
  db.all(`
    SELECT u.id, u.name, u.email, p.* 
    FROM users u 
    LEFT JOIN profiles p ON u.id = p.userId 
    WHERE u.role = 'employee'
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const decoded = rows.map(r => {
      ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'].forEach(k => {
        try { r[k] = JSON.parse(r[k]); } catch(e) {}
      });
      return r;
    });
    
    res.json(decoded);
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log('Backend API running on http://localhost:' + PORT));
