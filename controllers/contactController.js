// controllers/contactController.js

const { validationResult } = require('express-validator');
// controllers/contactController.js
const { validationResult } = require('express-validator');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, message } = req.body;

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'shivamsahani8285@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });
    if (error) throw new Error(error.message);

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification } = require('../utils/emailService');

// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  // Validation errors are collected by express-validator rules in contactRoutes.js
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  const { name, email, message } = req.body;

  // Save the message first — even if the email fails to send, we don't lose the message
  const savedMessage = await Message.create({ name, email, message });

  // Try to send the email notification, but don't fail the whole request if SMTP has an issue.
  // The visitor's message is safely stored either way.
  try {
    await sendContactNotification({
      name: savedMessage.name,
      email: savedMessage.email,
      message: savedMessage.message,
      createdAt: savedMessage.createdAt
    });
  } catch (emailError) {
    console.error('Failed to send contact notification email:', emailError.message);
  }

  return res.status(201).json({
    success: true,
    message: 'Message sent successfully!'
  });
});

module.exports = { submitContactForm };
