const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your Gmail address
    pass: "your-app-password",    // Replace with your App Password
  },
});

app.post("/send-otp", (req, res) => {
  const { email, name, otp } = req.body;

  const mailOptions = {
    from: "edubot@example.com",
    to: email,
    subject: "Welcome to EduBot!",
    text: `Dear ${name},\n\nThank you for registering with EduBot!\nYour OTP for login is: ${otp}\n\nBest regards,\nThe EduBot Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      return res.status(500).json({ message: "Error sending email" });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "OTP sent successfully" });
  });
});

app.listen(8001, () => console.log("Email server running on port 8001"));