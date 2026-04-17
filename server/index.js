import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { authenticateToken, authorizeRole } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/profile', authenticateToken, profileRoutes);
app.use('/api/admin', authenticateToken, authorizeRole('hr'), adminRoutes);

// Other Routes
app.use('/api', resumeRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/', (req, res) => res.json({ status: 'SkillTica API is running' }));

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
