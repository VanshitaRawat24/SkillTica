import { GoogleGenerativeAI } from '@google/generative-ai';
import db from '../db.js';
import { sendPushNotification } from './notificationController.js';

const calculateCompletion = (profile) => {
  const sections = ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'];
  let filled = 0;
  sections.forEach(s => {
    if (profile[s] && profile[s] !== 'null' && profile[s] !== '[]' && profile[s] !== '{}') filled++;
  });
  return Math.round((filled / 8) * 100);
};

export const getProfile = (req, res) => {
  db.get('SELECT * FROM profiles WHERE userId = ?', [req.params.userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    
    const profile = {};
    for (let key in row) {
      if (key !== 'userId' && key !== 'completionPct' && key !== 'score') {
        try { profile[key] = JSON.parse(row[key]); } catch(e) { profile[key] = row[key]; }
      } else {
        profile[key] = row[key];
      }
    }
    res.json(profile);
  });
};

export const updateProfileSection = (req, res) => {
  const { userId, section } = req.params;
  const data = JSON.stringify(req.body);
  
  const valid = ['personal', 'education', 'skills', 'experience', 'certs', 'projects', 'behavioral', 'career'];
  if (!valid.includes(section)) return res.status(400).json({ error: 'Invalid section' });
  
  db.run(`UPDATE profiles SET ${section} = ? WHERE userId = ?`, [data, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get('SELECT * FROM profiles WHERE userId = ?', [userId], (err, row) => {
      const pct = calculateCompletion(row);
      db.run('UPDATE profiles SET completionPct = ? WHERE userId = ?', [pct, userId]);
      res.json({ success: true, completionPct: pct });
    });
  });
};

export const scoreProfile = async (req, res) => {
  try {
    const { userId, skills, projects, experience } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze the following candidate profile:
      Skills: ${JSON.stringify(skills || [])}
      Projects: ${JSON.stringify(projects || [])}
      Experience: ${experience || 'None'}

      Provide a JSON output ONLY with the following structure:
      {
        "score": <number from 0 to 100>,
        "suggestions": ["string", "string"],
        "missing_fields": ["string", "string"]
      }
      
      Return NOTHING BUT valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    const score = typeof parsed.score === 'number' ? parsed.score : 0;

    // Save score to database if userId provided
    if (userId) {
      db.run('UPDATE profiles SET score = ? WHERE userId = ?', [score, userId]);
      
      // Trigger notification if score is low
      if (score < 50) {
        await sendPushNotification(
          'Low Profile Score',
          `Your profile score is ${score}/100. Check suggestions to improve!`,
          'simulated-token' // In production, get user token from DB
        ).catch(e => console.error('Failed to trigger low score notification:', e.message));
      }
    }

    return res.json({
      score: score,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      missing_fields: Array.isArray(parsed.missing_fields) ? parsed.missing_fields : []
    });

  } catch (error) {
    console.error('Error in scoreProfile:', error);
    return res.status(500).json({ error: 'Failed to analyze profile.', details: error.message });
  }
};

export const getCareerCoachAdvice = async (req, res) => {
  try {
    const { message, profile } = req.body;

    // Fallback Mock Responses if API Key is missing
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      const mockTips = [
        "That's a great direction! Given your current skills, I'd recommend looking into Advanced SQL and Data Visualization tools like Tableau next.",
        "Based on your profile, focusing on Python for Data Science and learning libraries like Pandas/Scikit-learn will directly boost your readiness.",
        "You should definitely explore Cloud Data Warehousing (like Snowflake or BigQuery) to complement your current analyst experience.",
        "I suggest working on a portfolio project that combines your Java and Python skills, perhaps an automated data pipeline!",
        "Networking with Senior Data Scientists in your area could give you more niche insights into the local job market."
      ];
      const randomTip = mockTips[Math.floor(Math.random() * mockTips.length)];
      return res.json({ response: `[Demo Mode] ${randomTip}` });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert AI Career Coach. 
      The user's current profile is: ${JSON.stringify(profile || {})}
      
      User says: "${message}"
      
      Provide a helpful, motivational, and technical career advice response. 
      Keep it conversational (2-3 sentences). 
      If they ask "what next", suggest a specific path based on their skills.
      Return ONLY the plain text response.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return res.json({ response: text });
  } catch (error) {
    console.error('Error in getCareerCoachAdvice details:', error);
    return res.status(500).json({ error: 'Failed to get career advice.', details: error.message });
  }
};
