import React, { useEffect, useState } from 'react'
import styles from '../styles/Username.module.css'
import {Toaster, toast} from 'react-hot-toast'
import {useFormik} from 'formik'
import { otpSchema } from '../helper/validate'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

export default function Recovery() {

    const[otpval,setOtpval] = useState();

    const navigate = useNavigate();

    const username = useAuthStore(state => state.auth.username)

    const getotp = async ()=>{
        try {
            let OTP = await generateOTP(username)
            if(OTP){
                setOtpval(OTP);
                return toast.success('OTP has been send to your email')
            }
        } catch (error) {
                return toast.error('Problem while generating otp')
        }
    }

    useEffect(()=>{
        getotp();
    },[])


    const formik = useFormik({
        initialValues:{
            otp:"",
        },
        validationSchema:otpSchema,
        onSubmit: async (values) => {

            try {
            let {status} = await verifyOTP({username,code:otpval})
            if(status === 201){
            toast.success('Verify Successfully!')
            navigate('/reset')
           }
            } catch (error) {
                return toast.error('Wrong OTP! Check email again')
            }
           
        }
    })

    // resend otp
    const resendOTP = async () =>{
        let sendPromise = generateOTP(username);
        toast.promise(sendPromise,{
            loading:'Sending...',
            success:<b>OTP has been send to your email</b>,
            error:<b>Could not send it</b>
        })

        let resendotpval = await sendPromise
        if(resendotpval){
            setOtpval(resendotpval)
        }
    }

  return (
    <div className="container mx-auto">

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center h-screen">
            <div className={styles.glass}>
                <div className="title flex flex-col items-center">
                    <h4>Recovery !</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Enter OTP to recover password
                    </span>
                </div>

                <form className="py-1" onSubmit={formik.handleSubmit}>

                    <div className="textbox flex flex-col items-center gap-6">

                      <div className="input text-center">
                      <span className="block py-4 text-sm text-center text-gray-500">
                          Enter 6 digit otp sent to your email address
                        </span>
                        
                        <input type="text" {...formik.getFieldProps('otp')} className={styles.textbox} placeholder='OTP'/>
                        <br/><span className="errorMessage">
                        {formik.touched.otp && formik.errors.otp}
                        </span>

                      </div>
                        <button type="submit" className={styles.btn}>Sign in</button>
                    </div>
                    
                </form>
                <div className="text-center py-8">
                        <span className='text-gray-500'>Can't get otp? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
                </div>
            </div>
        </div>
    </div>
  )
}
