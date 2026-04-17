import express from 'express';
import { notifyUser } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/notify', notifyUser);

export default router;
