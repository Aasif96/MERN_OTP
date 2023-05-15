import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import styles from '../styles/Username.module.css'
import {Toaster, toast} from 'react-hot-toast'
import {useFormik} from 'formik'
import { passwordSchema } from '../helper/validate'
import { useFetch } from '../hooks/fetch.hooks'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'

export default function Password() {
    const navigate = useNavigate();
    const [Bdisabled,setBdisabled] = useState(false);

    const username = useAuthStore(state => state.auth.username);

    const [{isLoading, apiData,  serverError}] = useFetch(`/user/${username}`);

    const formik = useFormik({
        initialValues:{
            password:"",
        },
        validationSchema:passwordSchema,
        onSubmit:  async (values) => {
           let loginPromise =  verifyPassword(username, values.password)
            toast.promise(loginPromise,{
                loading:'Checking...',
                success:<b>Login Successfully...!</b>,
                error:<b>Password not match</b>
            })

            try {
                setBdisabled(true)
               const res = await loginPromise;
               let token  = res.token;
               localStorage.setItem('token', token);
               navigate('/profile')
            } catch (error) {
                setBdisabled(false)
            }
        }
    })

    if(isLoading) return <h1 className='text-2xl text-bold'>isLoading</h1>;

    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center">
            <div className={styles.glass}>
                <div className="title flex flex-col items-center">
                    <h4>Hello {apiData?.firstName || apiData?.username}</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Explore more by connecting with us.
                    </span>
                </div>

                <form className="py-1" onSubmit={formik.handleSubmit}>
                    <div className="profile flex justify-center py-4">
                        <img className={styles.profile_img} src={apiData?.profile || avatar} alt="avatar" />
                    </div>

                    <div className="textbox flex flex-col items-center gap-6">
                        <input type="password" {...formik.getFieldProps('password')} className={styles.textbox} placeholder='Enter Password'/>
                        <span className="errorMessage">
                        {formik.touched.password && formik.errors.password}
                        </span>
                        <button disabled={Bdisabled} type="submit" className={styles.btn}>Sign in</button>
                    </div>
                    

                    <div className="text-center py-8">
                        <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
                    </div>
                </form>
                
            </div>
        </div>
    </div>
  )
}
