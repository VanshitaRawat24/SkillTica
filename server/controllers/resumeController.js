import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = '';

    // Check if file is uploaded
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } else if (req.file.mimetype === 'text/plain') {
        resumeText = req.file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' });
      }
    } else if (req.body.text) {
      // Fallback for direct text input
      resumeText = req.body.text;
    } else {
      return res.status(400).json({ error: 'Please provide either a resume file (field "resume") or text input (field "text").' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'No content extracted from the resume.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert technical recruiter and resume analyzer.
      Review the following resume content:
      
      "${resumeText}"

      Extract and provide a JSON output ONLY with the following exact structure:
      {
        "skills": ["skill_1", "skill_2"],
        "experience_summary": "A concise summary of their professional experience",
        "weaknesses": ["weakness_1", "weakness_2"],
        "suggestions": ["suggestion_1", "suggestion_2"]
      }
      
      Return NOTHING BUT valid JSON. Do not include markdown blocks like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the model output
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return res.status(500).json({ error: 'Invalid response format from AI. Text returned was not valid JSON.' });
    }

    return res.json({
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience_summary: parsed.experience_summary || '',
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    });

  } catch (error) {
    console.error('Error in analyzeResume:', error);
    return res.status(500).json({ error: 'Failed to analyze resume.', details: error.message });
  }
};
