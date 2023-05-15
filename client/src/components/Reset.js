import React,{useEffect, useState} from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import styles from '../styles/Username.module.css'
import {Toaster, toast} from 'react-hot-toast'
import {useFormik} from 'formik'
import { resetPasswordSchema } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store'
import { useFetch } from '../hooks/fetch.hooks'

export default function Reset() {

    const [Bdisabled,setBdisabled] = useState(false);

    const navigate = useNavigate();
    const [{isLoading, apiData, status, serverError}] = useFetch('createResetSession');

    // useEffect(()=>{
        
    // })

    const username = useAuthStore(state => state.auth.username);

    const formik = useFormik({
        initialValues:{
            password:"",
            confirm_pwd:"",
        },
        validationSchema:resetPasswordSchema,
        onSubmit:  async (values) => {
            let resetPromise = resetPassword(username,values.password);
            toast.promise(resetPromise,{
                loading:'Checking...',
                success:<b>Password Changed Successfully...!</b>,
                error:<b>Unable to reset password</b>
            })

            try {
                setBdisabled(true)
               const res = await resetPromise;
               if(res){
                navigate('/password')
               }
            } catch (error) {
                setBdisabled(false)
            }
        }
    })

    if(isLoading) return <h1 className='text-2xl text-bold'>isLoading</h1>;

    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;
     
    if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <div className="container mx-auto">

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center h-screen">
            <div className={styles.glass} style={{width:'50%'}}>
                <div className="title flex flex-col items-center">
                    <h4 className='text-5xl font-bold'>Reset</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Enter new password
                    </span>
                </div>

                <form className="py-10" onSubmit={formik.handleSubmit}>
                   
                    <div className="textbox flex flex-col items-center gap-6">
                        <input type="password" {...formik.getFieldProps('password')} className={styles.textbox} placeholder='Enter new Password'/>
                        <span className="errorMessage">
                        {formik.touched.password && formik.errors.password}
                        </span>
                        <input type="password" {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} placeholder='Confirm Password'/>
                        <span className="errorMessage">
                        {formik.touched.confirm_pwd && formik.errors.confirm_pwd}
                        </span>
                        <button type="submit" className={styles.btn}>Reset</button>
                    </div>
                
                </form>
                
            </div>
        </div>
    </div>
  )
}
