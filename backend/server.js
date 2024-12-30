import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import docRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor or /login or /all-doctors or /change-availablity
app.use('/api/doctor',docRouter)
//localhost:4000/api/doctor/getDocList
app.use('/api/user/',userRouter)
//localhost:4000/api/doctor/getDocList/register
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))