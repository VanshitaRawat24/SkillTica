import express from 'express';
import { 
  scoreProfile, 
  getProfile, 
  updateProfileSection, 
  getCareerCoachAdvice,
  getSkillGap,
  getPromotionReadiness,
  getRoleFit,
  getRoleFitDetails
} from '../controllers/profileController.js';

const router = express.Router();

// POST /api/profile/score (AI Scoring)
router.post('/score', scoreProfile);

// POST /api/profile/coach (AI Career Coach)
router.post('/coach', getCareerCoachAdvice);

// GET /api/profile/:userId
router.get('/:userId', getProfile);

// POST /api/profile/:userId/:section
router.post('/:userId/:section', updateProfileSection);

// AI Analysis Routes
router.get('/ai/skill-gap/:userId', getSkillGap);
router.get('/ai/promotion/:userId', getPromotionReadiness);
router.get('/ai/fit/:userId', getRoleFit);
router.get('/ai/role-fit/:userId', getRoleFitDetails);

export default router;
