const nodemailer = require("nodemailer");


module.exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.DOMAIN,
      pass: process.env.PASS
    }
});

