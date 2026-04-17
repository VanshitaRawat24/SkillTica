import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const id = 'emp_' + Math.random().toString(36).substr(2, 9);
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', 
      [id, name, email, hashedPassword, role || 'employee'], 
      function(err) {
        if (err) return res.status(400).json({ error: 'Email likely already exists' });
        
        // Create empty profile
        if (role !== 'hr') {
          db.run('INSERT INTO profiles (userId) VALUES (?)', [id]);
        }
        
        const token = jwt.sign({ id, email, role: role || 'employee' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { id, name, email, role: role || 'employee' }, token });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  });
};
