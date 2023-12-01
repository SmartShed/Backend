const { EMAIL, PASSWORD } = require('../config');
const nodemailer = require('nodemailer');

const otpEmailTemplate = `
<!DOCTYPE html>ww
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartShed Forgot Password OTP Template</title>
</head>
<body style="font-family: Arial, sans-serif;">

    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">

        <h2>Your OTP Code</h2>
        <p>Dear user [email],</p>
        <p>Your One-Time Password (OTP) is: <strong>[Your OTP Code]</strong></p>

        <p>Please use this code to reset the password</p>

        <p>Thank you,</p>
        <p>Team SmartShed</p>

    </div>

</body>
</html>
`


const sendMail = (otpData) => {
    console.log(otpData);
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "smartshedteam@gmail.com",
            pass: "cidx rouo rzao yjhi"
        }
    });



    const emailBody = otpEmailTemplate.replace("[Your OTP Code]", otpData.otp).replace("[email]", otpData.email);


    let mailDetails = {
        from: "smartshedteam@gmail.com",
        to: otpData.email,
        subject: 'Forgot Password',
        text: `Your OTP is ${otpData.otp}`,
        html: emailBody
    };


    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
            return -1;
        } else {
            console.log('Email sent successfully');
            return 1;
        }

    });
};



module.exports = sendMail;