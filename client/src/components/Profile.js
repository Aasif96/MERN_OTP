import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import avatar from '../assets/avatar.png'
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'
import { Toaster, toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileSchema } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { useFetch } from '../hooks/fetch.hooks'
// import { useAuthStore } from '../store/store'
import { updateUser } from '../helper/helper'

export default function Profile() {
  const navigate = useNavigate();

  const [file, setFile] = useState();

  const [{ isLoading, apiData, serverError }] = useFetch();

  const formik = useFormik({
    initialValues: {
      firstname:apiData?.firstname || '',
      lastname:apiData?.lastname || '',
      mobile:apiData?.mobile || '',
      email: apiData?.email || '',
      address:apiData?.address || ''
    },
    enableReinitialize:true,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise,{
        loading:'Updating',
        success:<b>Update successfully</b>,
        error:<b>Could not update</b>
      })

    }
  })

  // formik don't support file upload

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl text-bold'>isLoading</h1>;

  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em' }}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              You can update the details
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
              </label>

              <input type="file" id='profile' name='profile' onChange={onUpload} />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-full">
                <div className='w-full mx-2'>
                  <input {...formik.getFieldProps('firstname')} className='border-0 px-5 py-4 rounded-xl w-full shadow-sm text-lg' type="text" placeholder='Firstname*' />
                  <span className='block'>{formik.touched.firstname && formik.errors.firstname}</span>
                </div>

                <div className="w-full mx-2">
                  <input {...formik.getFieldProps('lastname')} className='border-0 px-5 py-4 rounded-xl w-full shadow-sm text-lg' type="text" placeholder='Lastname*' />
                  <span className="block">{formik.touched.lastname && formik.errors.lastname}</span>
                </div>

              </div>

              <div className="name flex w-full">

                <div className="w-full mx-2">
                  <input {...formik.getFieldProps('mobile')} className='border-0 px-5 py-4 rounded-xl w-full shadow-sm text-lg' type="text" placeholder='Mobile no*' />
                  <span className="block">{formik.touched.mobile && formik.errors.mobile}</span>
                </div>


                <div className="w-full mx-2">
                  <input {...formik.getFieldProps('email')} className='border-0 px-5 py-4 rounded-xl w-full shadow-sm text-lg' type="text" placeholder='Email*' />
                  <span className="block">{formik.touched.email && formik.errors.email}</span>
                </div>

              </div>


              <div className="flex w-full">
                <div className="w-full mx-2">
                  <input {...formik.getFieldProps('address')} className='border-0 px-5 py-4 rounded-xl w-full shadow-sm text-lg' type="text" placeholder='Address*' />
                  {formik.touched.address && formik.errors.address}
                </div>
              </div>



              <button className={styles.btn} type='submit'>Update</button>
            </div>

            <div className="text-center py-4">
                <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}
