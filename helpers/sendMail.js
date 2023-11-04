const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  // đây là code để xác thực
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // nó là tk xác thực 2 lớp
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // đây là code để gửi.
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
