const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: "co19524@gmail.com",
  pass: "dkroy8790",
});
module.exports = transporter;
