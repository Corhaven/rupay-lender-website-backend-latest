// const crypto = require("crypto");
const nodemailer = require("nodemailer");


const sendOtpEmail = async (email, otp) => {
  console.log(email,otp,process.env.EMAIL,process.env.APP_PASSWORD)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,  
        pass: process.env.APP_PASSWORD 
  
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};


// await sendEmail("user@example.com", otp);
module.exports ={sendOtpEmail}