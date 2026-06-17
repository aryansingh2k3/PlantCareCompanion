const nodemailer = require('nodemailer');

const sendReminderEmail = async (userEmail, plantName, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"PlantCare AI" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Reminder: Your ${plantName} needs attention!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2d7253;">Hello Plant Parent!</h2>
          <p>This is a friendly reminder from <strong>PlantCare AI</strong>.</p>
          <p>Your plant <strong>${plantName}</strong> is scheduled for: <strong>${message}</strong> today.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #2d7253; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">View Dashboard</a>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">Happy Planting!<br>The PlantCare Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Email Error:', error);
    return false;
  }
};

module.exports = { sendReminderEmail };
