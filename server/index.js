import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// Modular Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', resumeRoutes); // Provides /api/analyze-resume
app.use('/api', notificationRoutes); // Provides /api/notify

// Root Route
app.get('/', (req, res) => res.json({ 
    message: 'Welcome to SkillTica API',
    endpoints: ['/api/auth', '/api/profile', '/api/resume', '/api/admin', '/api/notify'],
    status: 'Running'
}));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 SkillTica Backend running on http://localhost:${PORT}`);
    console.log(`- Auth: /api/auth`);
    console.log(`- Profile: /api/profile`);
    console.log(`- Resume: /api/resume`);
    console.log(`- Admin: /api/admin`);
    console.log(`- Notify: /api/notify`);
});
