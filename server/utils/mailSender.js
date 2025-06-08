const nodemailer = require("nodemailer")

const mailSender = async (email,title,body) =>{
    // creating a trasporter function using nodemailer create function.
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        let info = await transporter.sendMail({
            from: 'StudyMotion || CodeHelp',
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log('Email sent:', info.response);
        return true;
        
        
    }
    catch(err){
        console.log(err.message);
        console.error('Error sending email:', err.message);
        return false;
    }
}

module.exports = mailSender