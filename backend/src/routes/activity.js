import express from 'express';
import { protect } from '../middleware/auth.js';
import { requireManager } from '../middleware/roleAuth.js';
import {
    getDealActivity,
    getUserActivity,
    getTeamActivity
} from '../controllers/activityController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get deal-specific activity
router.get('/deal/:dealId', getDealActivity);

// Get current user's activity
router.get('/user', getUserActivity);

// Get team activity (managers only)
router.get('/team', requireManager, getTeamActivity);

export default router;
