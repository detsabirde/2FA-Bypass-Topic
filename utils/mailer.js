const nodemailer = require("nodemailer");

let transporter;
let testAccount;

async function setupTransporter() {
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

async function sendVerificationEmail(to, code) {
  if (!transporter) await setupTransporter();

  const mailOptions = {
    from: '"SkillQuest" <no-reply@skillquest.com>',
    to,
    subject: "Your Verification Code",
    text: `Your code is: ${code}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
}

module.exports = { sendVerificationEmail };
