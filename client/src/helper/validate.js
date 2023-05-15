import { toast } from "react-hot-toast";
import * as Yup from 'yup';
import { authenticate } from "./helper.js";


export async function usernameValidate(values){
    const errors = usernameVerify({}, values)

    if(values.username){
      //chk user existence
        const {status} = await authenticate(values.username);
      
        if(status !== 200){
          errors.exist = toast.error('User does not exist....!')
        }

    }

    return errors;
}

function usernameVerify(error={}, values){
    if(!values.username){
        error.username = toast.error('Username required')
    }else if(values.username.includes(' ')){
        error.username = toast.error('Invalid Username')
    }

    return error;
}

// export const passwordSchema  = Yup.object().shape({
//     password: Yup.string()
//     .required(toast.error('No password provided'))
//     .min(8,'Password is too short')
    
// })

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(24, 'Password can be maximum 24 characters')
      .required('Password is Required')
  })

export const resetPasswordSchema = Yup.object().shape({
    password: Yup
      .string()
      .required('Password is required')
      .min(5, 'Your password is too short.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    confirm_pwd: Yup
      .string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Password and confirm Password must match')
    }); 


    export const registerSchema = Yup.object().shape({
      email : Yup.string().email('Please enter valid email').required('Email is required'),
      username:Yup.string().required('username is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(24, 'Password can be maximum 24 characters')
        .required('Password is Required')
    })


    export const profileSchema = Yup.object().shape({
      firstname:Yup.string().required('firstname is required'),
      lastname:Yup.string().required('lastname is required'),
      email : Yup.string().email('Please enter valid email').required('Email is required'),
      mobile:Yup.string().required('mobile no is required'),
      address:Yup.string().required('address is required'),
    })

    export const otpSchema = Yup.object().shape({
      otp:Yup.string().required('OTP is required').max(6, 'OTP cannot be greater than 6 digit'),
    })