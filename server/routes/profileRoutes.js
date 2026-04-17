import express from 'express';
import { scoreProfile, getProfile, updateProfileSection } from '../controllers/profileController.js';

const router = express.Router();

// POST /api/profile/score (AI Scoring - Move this up)
router.post('/score', scoreProfile);

// GET /api/profile/:userId
router.get('/:userId', getProfile);

// POST /api/profile/:userId/:section
router.post('/:userId/:section', updateProfileSection);

export default router;
