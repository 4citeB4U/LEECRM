// api/ai-followup.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing required "text"' });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: `Summarize the following and draft an appropriate follow-up email:\n\n${text}` }
      ],
      max_tokens: 600
    });
    const raw = completion.choices[0].message.content || '';
    // Optional: Split summary and email by a delimiter if needed
    const [summary, emailDraft] = raw.split(/(?:Email Draft:|--EMAIL--)/i).map(s => s.trim());
    res.status(200).json({
      summary: summary || raw,
      emailDraft: emailDraft || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}