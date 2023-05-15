import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import styles from '../styles/Username.module.css'
import {Toaster, toast} from 'react-hot-toast'
import {useFormik} from 'formik'
import { registerSchema } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'

export default function Register() {
  const navigate = useNavigate();

  const [file,setFile] = useState();
  const [Bdisabled,setBdisabled] = useState(false);

    const formik = useFormik({
        initialValues:{
          email:"",
          username:"",
          password:"",
        },
        validationSchema:registerSchema,
        onSubmit:  async (values) => {
          values =  await Object.assign(values,{profile : file || ''});
           const registerPromise = registerUser(values)
           toast.promise(registerPromise, {
            loading:'Creating...',
            success:(<b>Register Successfully</b>),
            error:(<b>Could not register</b>)
           })

           try {
            setBdisabled(true)
            await registerPromise
            navigate('/')
           } catch (error) {
            setBdisabled(false)
            throw new Error(error)
           }

        }
    })

    // formik don't support file upload

    const onUpload = async (e) =>{
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={file || avatar} className={styles.profile_img} alt="avatar" />
                  </label>
                  
                  <input type="file" id='profile' name='profile' onChange={onUpload}/>
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
                  {formik.touched.email && formik.errors.email}
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
                  {formik.touched.username && formik.errors.username}
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password*' />
                  {formik.touched.password && formik.errors.password}
                  <button disabled={Bdisabled} className={styles.btn} type='submit'>Register</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Already Register? <Link className='text-red-500' to="/">Login Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}
