// api/send-campaign.js
import Twilio from 'twilio';
// Uncomment if using EmailJS npm API, or use direct API/cdn for client-side send
// import emailjs from '@emailjs/browser';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { to, templateId, data } = req.body;
  if (!to || !templateId) return res.status(400).json({ error: 'Missing "to" or "templateId"' });

  try {
    let result;

    // Determine if to is phone (SMS) or email
    if (String(to).match(/^[0-9+\-\s]+$/)) { // crude check for SMS number
      const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      result = await client.messages.create({
        to,
        from: process.env.TWILIO_FROM,
        body: renderTemplate(templateId, data)
      });
    } else {
      // For email: use third-party API here, e.g. EmailJS REST call or SMTP
      // This is a placeholder, as most email provider APIs require server creds.
      // Replace with your transactional mail API of choice:
      // await emailjs.send('YOUR_SERVICE_ID', templateId, data, 'YOUR_PUBLIC_KEY');
      throw new Error('Email sending is not set up on the serverless backend. Use an email provider API here.');
    }

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Example function to render a text message template
function renderTemplate(templateId, data = {}) {
  // Replace with real template logic; here we just JSON-stringify
  return `Campaign Message [${templateId}]:\n\n${JSON.stringify(data, null, 2)}`;
}