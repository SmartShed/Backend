const { EMAIL, PASSWORD } = require("../config");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const otpEmailTemplate = fs.readFileSync(
  path.resolve(__dirname, "otpEmailTemplate.html"),
  { encoding: "utf-8" }
);

const sendMail = (userName, userEmail, otp) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "diesellocoshedpune@gmail.com",
      pass: "ojpe kyvt ylpe fsyg",
    },
  });

  const emailBody = otpEmailTemplate
    .replace("$$NAME$$", userName)
    .replace("$$EMAIL$$", userEmail)
    .replace("$$OTP$$", otp);

  let mailDetails = {
    from: "diesellocoshedpune@gmail.com",
    to: userEmail,
    subject: "SmartShed Forgot Password OTP",
    text: `Your One Time Password (OTP) for SmartShed is ${otp}. Please use this code to reset your password.`,
    html: emailBody,
  };

  return new Promise((resolve, reject) => {
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = sendMail;
