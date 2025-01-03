import React from 'react'
import { useContext } from 'react'
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from 'react';
import {assets} from '../../assets/assets_admin/assets'
import { AppContext } from '../../context/AppContext';
const DashBoard = () => {
  const {aToken,getDashData,dashData,cancelAppointment} = useContext(AdminContext)
  useEffect(()=>{
    if(aToken) {
      getDashData()
    }
  },[aToken])
  const {slotDateFormat} = useContext(AppContext);
  return dashData && (
    <div className='p-10'>
      <div className='flex flex-wrap gap-7'>
        <div className='flex items-center p-6 bg-white gap-3 w-[260px] rounded-lg cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 rounded-md'>
            <img src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-[25px] font-medium'>{dashData.doctors}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center p-6 bg-white gap-3 w-[260px] rounded-lg cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 rounded-md'>
            <img src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-[25px] font-medium'>{dashData.doctors}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center p-6 bg-white gap-3 w-[260px] rounded-lg cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-indigo-50 rounded-md'>
            <img src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-[25px] font-medium'>{dashData.doctors}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {
            dashData.lastestAppointments.map((item,index)=>(
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                  <img className='rounded-full w-10' src={item.docData.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                    <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                  </div>
                  {
                      item.cancelled ? 
                      <p className="text-red-400 text-xs font-medium">Cancelled</p>
                      :
                      <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DashBoard
