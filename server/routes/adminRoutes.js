import express from 'express';
import { getEmployees, getInsights, getDashboardData, getTeamBuilder } from '../controllers/adminController.js';

const router = express.Router();

router.get('/employees', getEmployees);
router.get('/insights', getInsights);
router.get('/dashboard', getDashboardData);
router.get('/team-builder', getTeamBuilder);

export default router;
