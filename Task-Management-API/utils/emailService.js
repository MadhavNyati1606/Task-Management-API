const nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "madhavnyati160602@gmail.com",
      pass: "kxsb urig shnf ildo",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Let the controller decide how to handle errors
  }
};

module.exports = sendEmail;
