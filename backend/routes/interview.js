const express = require('express');
const Groq    = require('groq-sdk');

const router = express.Router();
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/interview-questions
router.post('/interview-questions', async (req, res) => {
  try {
    const { jobRole = 'Software Engineer', strengths = [], weaknesses = [], ats_keywords_missing = [] } = req.body;

    const prompt = `You are an expert interview coach. Generate 5 tailored interview questions for a ${jobRole} candidate.

Candidate strengths: ${strengths.join(', ') || 'general professional skills'}
Candidate weaknesses: ${weaknesses.join(', ') || 'needs improvement in some areas'}
Keywords to probe: ${ats_keywords_missing.slice(0, 5).join(', ') || 'technical skills'}

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      temperature: 0.6,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = completion.choices[0]?.message?.content || '';

    let result;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      result = {
        questions: [
          `Tell me about your most impactful project as a ${jobRole}.`,
          'How do you handle tight deadlines and competing priorities?',
          'Describe a time you had to learn a new technology quickly.',
          'How do you approach code reviews and feedback?',
          'Where do you see yourself in 3-5 years?',
        ],
      };
    }

    res.json(result);
  } catch (err) {
    console.error('Interview error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
