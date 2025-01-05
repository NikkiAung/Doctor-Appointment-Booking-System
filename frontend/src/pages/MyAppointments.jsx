import { useContext, useEffect, useState } from "react"
import { AppContext } from "../contexts/AppContext"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const MyAppointments = () => {
  const {BACKEND_URL,token,getDoctorsData} = useContext(AppContext);
  const [appointments,setAppointments] = useState([])
  const navigate = useNavigate()
  const months = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const {data} = await axios.get(BACKEND_URL+'/api/user/appointments',{headers:{token}})
      if(data.success) {
        // console.log(data.appointments)
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    
    try {
      const {data} = await axios.post(BACKEND_URL+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      console.log(appointmentId)
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const paymentHandler = async (appointmentId,doctorId) => {
    try {
      console.log(appointmentId)
      const {data} = await axios.post(BACKEND_URL+'/api/user/checkout-session',{appointmentId,doctorId},{headers:{token}})
      if(data.success) {
        toast.success(data.message)
        if(data.session.url) {
          // console.log(data.session)
          window.location.href = data.session.url
          // await verifyingPaymentStatus(data.session.id,appointmentId)
        }
        else{
          toast.error("Session URL is missing.")
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // const verifyingPaymentStatus = async (sessionId, appointmentId) => {
  //   console.log('verifyingPaymentStatus frontend!');
  //   try {
  //     const { data } = await axios.post(BACKEND_URL + '/api/user/session_status', { sessionId }, { headers: { token } });
  
  //     if (data.status === 'open') {
  //       window.location.href = data.session.url;
  //     } else if (data.status === 'complete') {
  //       const { data: updateResponse } = await axios.post(
  //         BACKEND_URL + '/api/user/updating-db-payment',
  //         { appointmentId },
  //         { headers: { token } }
  //       );
  //       if (updateResponse.success) {
  //         toast.success(updateResponse.message);
  //         navigate('/checkout-success');
  //       } else {
  //         toast.error("Something went wrong while processing the payment!");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error verifying payment:", error);
  //     toast.error(error.message);
  //   }
  // };  

  useEffect(()=>{
    if(token) {
      getUserAppointments()
    }
  },[token])


  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments.map((item,index)=>(
          <div key={index} className="grid gird-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
                {
                  !item.cancelled ?            
                  <>
                    {!item.payment && !item.isCompleted ? (
                      <button onClick={()=>paymentHandler(item._id,item.docId)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-500">
                        Pay Online
                      </button> 
                    ) : (
                      <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                        Paid
                      </button>
                    )
                    }
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500" onClick={()=>cancelAppointment(item._id)}>
                      Cancel appointment
                    </button>
                  </>
                  : 
                  <>
                    {
                      !item.isCompleted 
                      ? (
                        <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green">Completed</button> 
                      )
                      : (
                      <button type="button" className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment cancelled</button>
                      )
                    }
                  </>
                }

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
