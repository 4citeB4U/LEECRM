// api/transcribe.js
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if longer audio
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { audio } = req.body;
  if (!audio) return res.status(400).json({ error: 'Missing audio data.' });

  try {
    // Convert DataURL/base64 to buffer
    const matches = audio.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid audio data format (must be base64 DataURL)');
    const base64 = matches[2];
    const audioBuffer = Buffer.from(base64, 'base64');

    // OpenAI Whisper API accepts multipart file, so we must use FormData
    // (Vercel edge and OpenAI npm both support fetch/FormData)
    const fd = new FormData();
    fd.append('file', new Blob([audioBuffer]), 'audio.webm');
    fd.append('model', 'whisper-1');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: fd,
    });
    if (!response.ok) throw new Error(await response.text());

    const result = await response.json();
    res.status(200).json({ transcript: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}