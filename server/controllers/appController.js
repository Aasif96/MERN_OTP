import userModel from "../Model/userModel.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from "otp-generator"


// register
export const register = async (req,res,next)=>{
    
    try {
        const {username, password, profile, email} = req.body;

        if(password.trim().length < 4){
            return res.status(400).json({
                success:false,
                message:"Password cannot be less than four characters"
            })
        }

        if(password){
            const hashPassword = await bcrypt.hash(password,10);

          const user = await userModel.create({
                username,
                password:hashPassword,
                profile:profile || '',
                email
              })

          if(user){
            res.status(200).json({
                success:true,
                message:'User register successfully'
            })
          }
        }
        
    } catch (error) {
       return next(error)
    }

}


// login
export const login = async (req,res,next)=>{

    const {username,password} = req.body;

    try {
        const  user = await userModel.findOne({username})
        
        if(!username){
            res.status(404).json({
                success:false,
                message:'Username not found'
            })
        }

        const passwordCheck = await bcrypt.compare(password,user.password); 

        if(!passwordCheck){
            res.status(400).json({
                success:false,
                message:'Invalid Email or Password'
            })
        }

        const token = jwt.sign({
            userId:user._id,
            username:user.username
        },process.env.JWT_SECRET,{expiresIn:"24h"});

        res.status(200).json({
            success:true,
            message:"Login successfully",
            username:user.username,
            token
        })

    } catch (error) {
        return next(error)
    }

}


// getUser
export const getUser = async (req,res,next)=>{

    const {username} = req.params;

    try {
        
      let user = await userModel.findOne({username}).select("-password");

      if(!user){
        res.status(404).json({
            success:false,
            message:"User not found"
        })
      }else{
        res.status(200).json({
            success:true,
            user
        })
      }

    } catch (error) {
         return next(error)
    }

}


export const updateUser = async (req,res,next) =>{

    try {

      //let id = await userModel.findById(req.params.id);

      const {userId} = req.user;

      if(!userId){
        res.status(404).json({
            success:false,
            message:"User not found"
        })
      }else{
        
        let user = await userModel.findByIdAndUpdate(userId,req.body,{
            new: true,
            runValidators: true,     //this whole object for email unique validation
            useFindAndModify: false,
          })

          res.status(200).json({
            success:true,
            message:"user updated successfuly"
          })
      }
      
    } catch (error) {
        return next(error)
    }

}


// generate otp
export const generateOTP = async (req,res) =>{

req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false, specialChars:false})
if(req.app.locals.OTP)
res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"})
 }


 export const resetPassword = async (req,res,next) =>{

    try {
        
      if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

      const {username,password} = req.body; 
      
      const user = userModel.findOne({username})

      if(!user){
        return res.status(404).json({
            success:false,
            message:"Username not found"
        })
      }else{

        const hashPassword = await bcrypt.hash(password,10)

        if(!hashPassword){
           return res.status(500).json({
                success:false,
                message:"Unable to reset password"
            })
        }

        const data = await userModel.updateOne({username},{password:hashPassword})

        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })

      }

    } catch (error) {
        return next(error)
    }

 }