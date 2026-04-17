import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// Modular Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', resumeRoutes); // Provides /api/analyze-resume
app.use('/api', notificationRoutes); // Provides /api/notify

// Root Route
app.get('/', (req, res) => res.json({ 
    message: 'Welcome to SkillTica API',
    endpoints: ['/api/auth', '/api/profile', '/api/resume', '/api/admin', '/api/notify'],
    status: 'Running'
}));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 SkillTica Backend running on http://localhost:${PORT}`);
    console.log(`- Auth: /api/auth`);
    console.log(`- Profile: /api/profile`);
    console.log(`- Resume: /api/resume`);
    console.log(`- Admin: /api/admin`);
    console.log(`- Notify: /api/notify`);
});
<<<<<<< HEAD

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
=======
>>>>>>> 9079c61c652579c58fee0141b3efc137d030d75c
