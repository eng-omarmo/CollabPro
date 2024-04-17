const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.Myemail,
      pass: process.env.Mypassword
    }
  });

  // Define email options
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text
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
