// scripts/createAdmin.js
// Run once to create your admin login: npm run create-admin
// Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env.
// There is no public "register" endpoint on purpose — only you should be able to create admins.
const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

(async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file before running this script.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`An admin with email ${email} already exists. No changes made.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await Admin.create({ email, password }); // password is hashed by the pre-save hook
  console.log(`Admin account created successfully for ${admin.email}`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
});
