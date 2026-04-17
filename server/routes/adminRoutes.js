import express from 'express';
import { getEmployees } from '../controllers/adminController.js';

const router = express.Router();

router.get('/employees', getEmployees);

export default router;
