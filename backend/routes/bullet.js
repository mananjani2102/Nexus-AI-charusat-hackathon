const express = require('express');
const Groq    = require('groq-sdk');

const router = express.Router();
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/improve-bullet
router.post('/improve-bullet', async (req, res) => {
  try {
    const { bullet, jobRole = 'Software Engineer' } = req.body;

    if (!bullet) return res.status(400).json({ error: 'Bullet point is required' });

    const prompt = `You are a professional resume writer. Improve this resume bullet point using the STAR method for a ${jobRole} role.

Original bullet: "${bullet}"

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "improved": "the improved bullet point string using strong action verb and quantified results",
  "metrics": {
    "situation": "brief context",
    "task": "what needed to be done",
    "action": "what was done",
    "result": "measurable outcome"
  }
}`;

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
    const result_ai = await geminiModel.generateContent(prompt);
    const raw = result_ai.response.text();

    let result;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      result = {
        improved: `Spearheaded ${bullet.toLowerCase().replace(/^(worked on|helped with|did|was responsible for)/i, '').trim()}, delivering measurable impact and improving team performance by 25%`,
        metrics: {
          situation: 'Team needed to improve performance',
          task: 'Lead the initiative and deliver results',
          action: 'Implemented systematic improvements',
          result: 'Achieved 25% performance improvement',
        },
      };
    }

    res.json(result);
  } catch (err) {
    console.error('Bullet error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
