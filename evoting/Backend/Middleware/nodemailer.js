// In your backend code where you set up nodemailer transporter
const nodemailer = require('nodemailer');

// Create a nodemailer transporter using Ethereal account
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'flavio.hegmann@ethereal.email',
    pass: 'EaywAjshRCBXBBTjTP',
  },
});

module.exports = transporter; 
