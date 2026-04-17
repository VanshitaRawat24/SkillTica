import db from '../db.js';

export const register = (req, res) => {
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
};

export const login = (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: row });
  });
};
