import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {BACKEND_URL,token,setToken} = useContext(AppContext)
  const navigate = useNavigate();
  const formSubmitHandler = async (e) => {
      try {
        if(state === 'Sign Up') {
          e.preventDefault();
          const {data} = await axios.post(BACKEND_URL + '/api/user/register',{name,email,password})
          if(data.success) {
            localStorage.setItem('token',data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
        } else {
          e.preventDefault();
          const {data} = await axios.post(BACKEND_URL + '/api/user/login',{email,password})
          if(data.success) {
            localStorage.setItem('token',data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
        }
      } catch (error) {
        toast.error(data.message)
      }
    } 

    useEffect(()=>{
      if(token) {
        navigate('/')
      }
    },[token])
  return (
    <div className="flex items-center justify-center mt-30">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
          <p className="text-sm text-gray-500 mb-6">{state === 'Sign Up' ? 'Please sign up to book appointment' : 'Please log in to book appointment'}</p>
          <form onSubmit={formSubmitHandler}>
            {state === 'Sign Up' ? <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input onChange={(e)=>setName(e.target.value)}
                value={name}
                type="text"
                id="fullName"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your full name"
                required
              />
            </div> : ""}

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input onChange={(e)=>setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input onChange={(e)=>setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-900 transition"
            >
              {state === 'Login' ? 'Login' :'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {state === 'Login' ? <p className="">Create an new account? <span className="text-primary underline cursor-pointer" onClick={()=>setState('Sign Up')}> Click here</span> </p> : <p>Already have an account?<span className="text-primary underline cursor-pointer" onClick={()=>setState('Login')}> Login here</span></p>}
          </p>
        </div>
    </div>
  )
}

export default Login
