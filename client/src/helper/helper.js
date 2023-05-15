import axios from "axios";
import jwt_decode from "jwt-decode"

axios.defaults.baseURL = "http://localhost:8080";


// To get username from token
export const getUsername = async () =>{
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find token")
    let decode = jwt_decode(token);
    return decode;
}


// Authenticate function
export const authenticate = async (username) =>{
    try {
        return await axios.post('/api/authenticate', {username})
    } catch (error) {
        return {error : "Username doesn't exist"}
    }
}

// get user details
export const getUser = async (username) =>{
   try {
       const { data } = await axios.get(`/api/user/${username}`)
        return {data}
   } catch (error) {
        return {error : "Password does not match"}
   } 
}

//register user function
export const registerUser = async (credentials) => {

    try {
        const {data : {message}, status} = await axios.post('/api/register/',credentials);

        let {username,email} = credentials;

        // Send Email
        if(status === 200){
            await axios.post('/api/registerMail', {username, userEmail: email, text:message })

            return message
        }
        //return Promise.resolve(message)

    } catch (error) {
        throw new Error(400);
    }

}


//Login user function
export const verifyPassword = async (username,password) =>{

    try {
        if(username){
           const {data} = await axios.post('/api/login',{username,password});
           return data;
        }
    } catch (error) {
        throw new Error(400);
    }

}

//Update user function
export const updateUser = async (response) =>{

    try {
        const token = localStorage.getItem('token');
        const data = await axios.put(`/api/updateUser`,response,{
            headers :{
                "Authorization" : `Bearer ${token}`
            }
        })

        return data;

    } catch (error) {
        throw new Error(400);
    }

}


//Generate OTP
export const  generateOTP = async (username) =>{

    try {
        
        const {data : {code}, status} = await axios.get('api/generateOTP', {params : {username}});
        
        if(status === 201){
            let res =  await getUser(username)
           //let {data : {email}} =  await getUser(username)
           
           let text = `Your password recovery otp is ${code}`;
           await axios.post('/api/registerMail', {username, userEmail:res.data.user.email,text,subject:"Password recovery otp"})
        }
        return code;
    } catch (error) {
        throw new Error(400);
    }

}

// verifyotp
export const verifyOTP = async ({username,code})=>{
    try {
       const {data, status} =  await axios.get('/api/verifyOTP',{params : {username,code}})
       return {data,status}
    } catch (error) {
        return {error: 'Unable to verify otp'}
    }
}

//reset password
export const resetPassword = async (username,password) =>{
    try {
        const {data,status} = await axios.put('/api/resetPassword', {username,password})
        return {data,status}
    } catch (error) {
        throw new Error(400);
    }
}