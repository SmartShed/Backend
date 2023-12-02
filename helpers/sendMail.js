const { EMAIL, PASSWORD } = require("../config");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// const otpEmailTemplate = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>SmartShed Forgot Password OTP</title>
// </head>
// <body style="font-family: Arial, sans-serif;">

//     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">

//         <h2>SmartShed Forgot Password OTP</h2>

//         <br>

//         <p>Dear user [email],</p>

//         <br>

//         <p>Your One Time Password (OTP) for SmartShed is <strong>[Your OTP Code]</strong></p>
//         <p>Please use this code to reset your password.</p>

//         <br>
//         <br>

//         <p>Regards,</p>
//         <p>Thank you,</p>
//         <p>Team SmartShed</p>

//     </div>

// </body>
// </html>
// `;

const otpEmailTemplate = fs.readFileSync(
  path.resolve(__dirname, "otpEmailTemplate.html"),
  { encoding: "utf-8" }
);

const sendMail = (otpData) => {
  console.log(otpData);
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smartshedteam@gmail.com",
      pass: "cidx rouo rzao yjhi",
    },
  });

  const emailBody = otpEmailTemplate
    .replace("$$EMAIL$$", otpData.email)
    .replace("$$OTP$$", otpData.otp);

  let mailDetails = {
    from: "smartshedteam@gmail.com",
    to: otpData.email,
    subject: "SmartShed Forgot Password OTP",
    text: `Your One Time Password (OTP) for SmartShed is ${otpData.otp}. Please use this code to reset your password.`,
    html: emailBody,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs " + err);
      return -1;
    } else {
      console.log("Email sent successfully");
      return 1;
    }
  });
};

module.exports = sendMail;
