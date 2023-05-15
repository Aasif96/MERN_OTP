import React, {useEffect} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import styles from '../styles/Username.module.css'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

export default function Username() {

    const navigate = useNavigate();

    const setUsername = useAuthStore(state => state.setUsername);
    const username = useAuthStore(state => state.auth.username);


    useEffect(()=>{
        //console.log(username)
    })

    const formik = useFormik({
        initialValues:{
            username:''
        },
        validate:usernameValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async values => {
            setUsername(values.username)
            navigate('/password')
        }
    })

  return (
    <div className="container mx-auto">

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center">
            <div className={styles.glass}>
                <div className="title flex flex-col items-center">
                    <h4>Welcome back !</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Explore more by connecting with us.
                    </span>
                </div>

                <form className="py-1" onSubmit={formik.handleSubmit}>
                    <div className="profile flex justify-center py-4">
                        <img className={styles.profile_img} src={avatar} alt="avatar" />
                    </div>

                    <div className="textbox flex flex-col items-center gap-6">
                        <input type="text" {...formik.getFieldProps('username')} className={styles.textbox} placeholder='username'/>
                        <button type='submit' className={styles.btn}>Let's Go</button>
                    </div>

                    <div className="text-center py-8">
                        <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Here</Link></span>
                    </div>
                </form>
                
            </div>
        </div>
    </div>
  )
}
