const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const from = process.env.RESEND_FROM || 'Offer When <onboarding@resend.dev>';
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured (RESEND_API_KEY)' });
  }

  try {
    const { to, subject, body, attachment } = req.body || {};
    if (!to || typeof to !== 'string' || !to.trim()) {
      return res.status(400).json({ error: 'Recipient (to) is required' });
    }

    const attachments = [];
    if (attachment && attachment.filename && attachment.content) {
      const content = Buffer.from(attachment.content, 'base64');
      attachments.push({ filename: attachment.filename, content });
    }

    const { data, error } = await resend.emails.send({
      from,
      to: [to.trim()],
      subject: subject || '(No subject)',
      text: body || '',
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      return res.status(400).json({ error: error.message || 'Failed to send email' });
    }
    return res.status(200).json({ id: data?.id, message: 'Email sent' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
};
