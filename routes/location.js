import express from 'express';
import auth from '../middlewares/auth.js';
import { getNearMe } from '../controllers/location.js';


const router = express.Router();

router.get('/nearme', auth, getNearMe);


export default router;