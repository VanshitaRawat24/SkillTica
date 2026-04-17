import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Route: POST /api/analyze-resume
// Handles multipart/form-data with 'resume' field name, or JSON body with 'text' field
router.post('/analyze-resume', upload.single('resume'), analyzeResume);

export default router;
