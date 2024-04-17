const { text } = require('express');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.myEmail,
      pass: process.env.myAppPassword
    }
  });

  // Define email options
  const mailOptions = {
    from: `CollabPro App ${process.env.myEmail}`,
    to: to,
    subject: subject,
    html: html
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
