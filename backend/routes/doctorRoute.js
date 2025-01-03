import express from 'express';
import { getDocList,loginDoctor } from '../controllers/doctorController.js';

const docRouter = express.Router()

docRouter.get('/list',getDocList)
docRouter.post('/login',loginDoctor)

export default docRouter