import express from 'express';
import { getPipelineAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/pipeline', getPipelineAnalytics);

export default router;
