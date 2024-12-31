import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const MyProfile = () => {
  // const [userData, setUserData] = useState({
  //   name: "Edward Vincent",
  //   image: assets.profile_pic,
  //   email: "richardjameswap@gmail.com",
  //   phone: "+1 123 456 7890",
  //   address: {
  //     line1: "57th Cross, Richmond",
  //     line2: "Circle, Church Road, London",
  //   },
  //   gender: "Male",
  //   dob: "2000-01-20",
  // });
  const [isEdit, setEdit] = useState(false);
  const {userData,setUserData,token,BACKEND_URL,getUserProfile} = useContext(AppContext);
  const [image,setImage] = useState(false)
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data} = await axios.post(BACKEND_URL+'/api/user/update-profile',formData,{headers:{token}})

      if (data.success) {
        toast.success(data.message)
        await getUserProfile()
        setEdit(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {
        isEdit
        ? 
        <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden/>
        </label>
        : <img src={userData.image} alt="" className="w-36 rounded" />
      }

      {/* name */}
      <div>
      {
        isEdit ? 
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' value={userData.name} onChange={(e)=>setUserData(prev => ({...prev, name : e.target.value}))} type="text" name="username" id="username" required/> 
        : 
        <p className='text-3xl font-medium max-w-60 mt-4'>{userData.name}</p>
      }
      </div>

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <p className='underline text-neutral-500 mt-3'>CONTACT INFORMATION</p>

      
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
        {/* Email */}
 
        <p className='font-medium'>Email id:</p>
        {
          isEdit ?
          <input className='bg-gray-100 max-w-52' value={userData.email} onChange={(e)=>setUserData(prev=>({...prev,email:e.target.value}))} type="email" name="email" id="email" required/>
          :
          <p className='text-blue-400'>{userData.email}</p>
        }

        {/* Phone */}
        <p className='font-medium'>Phone:</p>
        {
          isEdit ?
          <input className='bg-gray-50 max-w-52' value={userData.phone} onChange={(e)=>setUserData(prev=>({...prev,phone:e.target.value}))} type="text" name="phone" id="phone" required/>
          :
          <p className='text-blue-400'>{userData.phone}</p>
        }
        {/* Address: */}
        <p className='font-medium'>Address:</p>
        {
          isEdit ?
          <p>
            <input className='bg-gray-50' value={userData.address.line1} onChange={(e)=>setUserData(prev=>({...prev, address: {...prev.address, line1: e.target.value}}))} type="text" name="address1" id="address1" required/>
            <br />
            <input className='bg-gray-50' value={userData.address.line2} onChange={(e)=>setUserData(prev=>({...prev, address: {...prev.address, line2: e.target.value}}))} type="text" name="address2" id="address2" required/>
          </p>
          :
          <p className='text-gray-500'>{userData.address.line1} 
          <br /> 
          {userData.address.line2}
          </p>
      
        }
      </div>

      <div>
          <p className='underline text-neutral-500 mt-3'>BASIC INFORMATION</p>
          
          {/* Address: */}
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className='font-medium'>Gender:</p>
            {
              isEdit ?
                <select className='max-w-20 bg-gray-100' value={userData.gender} onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))} name="gender" id="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              :
              <div>
                <p className='text-gray-400'>{userData.gender}</p>
              </div>
            }
            {/* Birthday */}
            <p className='font-medium'>Birthday:</p>
            {
              isEdit ?
                <input className='max-w-28 bg-gray-100' value={userData.dob} onChange={(e)=>setUserData(prev=>({...prev, dob : e.target.value}))} type="date" name="Birthday" id="Birthday" />
              :
              <p className="text-gray-400">{userData.dob}</p>
            }
        </div>
        <div className="mt-5">
            {
                isEdit ?
                <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-500' onClick={updateUserProfileData}>
                  Save information
                </button>
                :
                <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-500' onClick={()=>setEdit(true)}>
                  Edit
                </button>
            }
            </div>
      </div>
    </div>
  )
}

export default MyProfile
