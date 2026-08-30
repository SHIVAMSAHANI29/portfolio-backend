// utils/emailService.js
// Reusable email service built on Nodemailer.
// Credentials come only from environment variables — never hard-coded.

const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587/others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

/**
 * Sends a notification email when a visitor submits the contact form.
 * @param {{ name: string, email: string, message: string, createdAt: Date }} data
 */
async function sendContactNotification({ name, email, message, createdAt }) {
  const mailer = getTransporter();

  const submittedAt = new Date(createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Basic HTML-escaping so submitted content can't break the email markup
  const escape = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#6c63ff;">New Portfolio Contact Message</h2>
      <p><strong>Name:</strong> ${escape(name)}</p>
      <p><strong>Email:</strong> ${escape(email)}</p>
      <p><strong>Date/Time:</strong> ${escape(submittedAt)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background:#f5f5f7; padding:12px; border-radius:8px;">${escape(message)}</p>
    </div>
  `;

  const text = `New Portfolio Contact Message\n\nName: ${name}\nEmail: ${email}\nDate/Time: ${submittedAt}\n\nMessage:\n${message}`;

  await mailer.sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    subject: `New message from ${name} (Portfolio Contact Form)`,
    text,
    html
  });
}

module.exports = { sendContactNotification };
