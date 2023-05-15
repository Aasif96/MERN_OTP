import mongoose from "mongoose";


export const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],        
        unique:[true, 'Username exist']
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength: [8, 'password cannot less than 8 characters'],
        unique:false,
    },
    email:{
        type:String,
        required:[true,'Email is required'],        
        unique:true
    },
    firstname:{type:String},
    lastname:{type:String},
    mobile:{type:Number},
    address:{type:String},
    profile:{type:String}
})


export default mongoose.model('User',userSchema)