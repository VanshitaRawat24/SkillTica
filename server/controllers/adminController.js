import db from '../db.js';

export const getEmployees = (req, res) => {
  const { skill, minScore } = req.query;
  
  let query = `
    SELECT u.id, u.name, u.email, p.* 
    FROM users u 
    LEFT JOIN profiles p ON u.id = p.userId 
    WHERE u.role = 'employee'
  `;
  
  const params = [];

  if (skill) {
    // Using parameterization to avoid SQL injection
    query += ` AND p.skills LIKE ?`;
    params.push(`%${skill}%`);
  }

  if (minScore) {
    query += ` AND p.score >= ?`;
    params.push(parseInt(minScore, 10));
  }

  query += ` ORDER BY p.score DESC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    
    // Parse JSON fields
    const decoded = rows.map(r => {
      ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'].forEach(k => {
        try { r[k] = JSON.parse(r[k]); } catch(e) {}
      });
      return r;
    });
    
    res.json({ employees: decoded });
  });
};
