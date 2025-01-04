import express from 'express';
import { getDocList,loginDoctor,appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const docRouter = express.Router()

docRouter.get('/list',getDocList)
docRouter.post('/login',loginDoctor)
docRouter.get('/appointments',authDoctor,appointmentsDoctor)
docRouter.post('/complete-appointment',authDoctor,appointmentComplete)
docRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
docRouter.get('/dashboard',authDoctor,doctorDashboard)

export default docRouter