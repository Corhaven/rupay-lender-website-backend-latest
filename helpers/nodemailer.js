const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async(subject,htmlMessage,message,recipients)=>{
console.log(subject,htmlMessage,message,recipients)
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL,  
            pass: process.env.APP_PASSWORD     
    }
});


for (let recipient of recipients) {
    let mailOptions = {
        from: process.env.EMAIL,  // Sender's email
        to: recipient.email,      // Recipient's email
        subject: subject,         // Email subject
        text: message,  // Plain text message
        html: htmlMessage  // HTML message with placeholders replaced
    };
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Message sent to ${recipient.email}`, info.messageId);
    } catch (error) {   
        console.error(`Error sending email to ${recipient.email}:`, error);
    }
}
};
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
// });



module.exports = {sendEmail}