import express from 'express';
import { scoreProfile, getProfile, updateProfileSection, getCareerCoachAdvice } from '../controllers/profileController.js';

const router = express.Router();

// POST /api/profile/score (AI Scoring - Move this up)
router.post('/score', scoreProfile);

// POST /api/profile/coach (AI Career Coach)
router.post('/coach', getCareerCoachAdvice);

// GET /api/profile/:userId
router.get('/:userId', getProfile);

// POST /api/profile/:userId/:section
router.post('/:userId/:section', updateProfileSection);

export default router;
