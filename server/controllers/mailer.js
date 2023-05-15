import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

let nodeConfig = {
    service: 'gmail',
    //host : "smtp.ethereal.email",
    //port: 587,
    //secure: false,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let Mailgenerator = new Mailgen({
    theme:"default",
    product:{
        name:'Mailgen',
        link:'https://mailgen.js/'
    }
})

export const registerMail = async (req,res) =>{

    const { username, userEmail, text, subject } = req.body;

    //body of the email
    var email = {
        body:{
            name:username,
            intro:text || 'Welcome the my youtube channel',
            outro: 'Need help'
        }
    }

    var emailBody = Mailgenerator.generate(email);

    let message = {
        from: process.env.EMAIL,
        to:userEmail,
        subject:subject || "Signup successfully",
        //html :emailBody
        html:text || '<h1>Email working</h1>',
    }

    //send mail
    // try {
    //     let send = await transporter.sendMail(message);
    //     res.status(200).json({
    //         message:'Email send successfully'
    //     })
        
    // } catch (error) {
    //     res.status(400).json({
    //         message:'Unable to send email'
    //     })
    //     console.log(error)
    // }

    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).json({
            message:'send successfully'
        })
    })
    .catch((err)=>{
        res.status(500).json({
            message:err
        })
    })

}