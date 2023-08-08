const nodemailer = require("nodemailer");

// trasporter setup to send the mail
module.exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.DOMAIN,
      pass: process.env.PASS
    }
});

