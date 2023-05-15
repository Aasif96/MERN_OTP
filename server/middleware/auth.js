import userModel from "../Model/userModel.js";
import  jwt from "jsonwebtoken";

export const isAuthenticatedUser = async (req,res,next)=>{

    try {
        const {username} = req.method == 'GET' ? req.query : req.body;

        // check user
        let exist = await userModel.findOne({username})

        if(!exist){
            res.status(404).json({
                success:false,
                message:"Unable to Authenticate"
            })
        }

        next();

    } catch (error) {
        return next(error)
    }

}

export const Auth = async (req,res,next) =>{

    try {

        //access authorize header
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET)
        // res.json(decodedToken)
        req.user = decodedToken;
        
        next();
        
    } catch (error) {
        res.status(401).json({
            success:false,
            message:"Authentication failed"
        })
    }

}


export const localVariables = (req,res,next) => {

    req.app.locals = {
        OTP:null,
        resetSession:false
    }
    next();
}