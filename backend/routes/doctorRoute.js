import express from 'express';
import { getDocList } from '../controllers/doctorController.js';

const docRouter = express.Router()

docRouter.get('/list',getDocList)

export default docRouter