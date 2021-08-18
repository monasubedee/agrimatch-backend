import express from 'express';
import auth  from '../middlewares/auth.js';
import { saveChat } from '../controllers/chat.js';


const router = express.Router();


router.post('/saveChat', auth, saveChat);


export default router;