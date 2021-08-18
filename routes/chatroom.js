import express from 'express';
import auth from '../middlewares/auth.js';
import { createGroupChatRoom } from '../controllers/chatroom.js';


const router = express.Router();


router.post('/createChatRoom', auth, createGroupChatRoom);


export default router;