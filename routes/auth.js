const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const userDB = { username: "admin", password: "password123", email: "test@example.com" };
let verificationCode = null;

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === userDB.username && password === userDB.password) {
        req.session.user = username;

        // Generate random 6-digit code
        verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userDB.email,
            subject: "Your 2FA Verification Code",
            text: `Your verification code is: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.render('login', { error: "Error sending email!" });
            }
            res.redirect('/verify');
        });

    } else {
        res.render('login', { error: "Invalid credentials!" });
    }
});

router.get('/verify', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('verify', { error: null });
});

router.post("/verify-code", (req, res) => {
    const { email, code } = req.body;
    if (codes[email] === code) {
      delete codes[email];
      res.json({ message: "✅ Code verified!" });
    } else {
      res.status(400).json({ message: "❌ Invalid code" });
    }
  });

module.exports = router;