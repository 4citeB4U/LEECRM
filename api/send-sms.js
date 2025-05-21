// api/send-sms.js
import Twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: 'Missing "to" or "message"' });

  const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  try {
    // Accept both single and array recipients
    const recipients = Array.isArray(to) ? to : [to];
    for (let recipient of recipients) {
      await client.messages.create({
        to: recipient,
        from: process.env.TWILIO_FROM,
        body: message
      });
    }
    res.status(200).json({ success: true, count: recipients.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}