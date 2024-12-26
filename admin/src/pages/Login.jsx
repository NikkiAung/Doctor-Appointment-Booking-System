import { useState } from "react"
import { assets } from "../assets/assets_admin/assets"

const Login = () => {
  const [state, setState] = useState('Admin')
  return (
    <form className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
            <p className="text-2xl font-semibold m-auto"> <span className="text-primary">{state} </span>Login</p>
            <div className="w-full">
                <p>Email</p>
                <input type="email" className="border border-[#DADADA] rounded w-full p-2 mt-1" required />
            </div>
            <div className="w-full">
                <p>Passowrd</p>
                <input type="passowrd" className="border border-[#DADADA] rounded w-full p-2 mt-1" required />
            </div>
            <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
            {
                state === 'Admin'
                ? <p>Doctor Login? <span onClick={()=>setState('Doctor')} className="text-primary underline cursor-pointer">Click Here</span> </p>
                : <p>Admin Login? <span onClick={()=>setState('Admin')} className="text-primary underline cursor-pointer">Click Here</span> </p>
            }
        </div>
    </form>
  )
}

export default Login
