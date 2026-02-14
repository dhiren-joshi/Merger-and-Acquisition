import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    shareDealAnalysis,
    getSharedAnalyses,
    revokeAccess
} from '../controllers/sharingController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Share a deal analysis
router.post('/share', shareDealAnalysis);

// Get all shared analyses
router.get('/', getSharedAnalyses);

// Revoke access
router.patch('/:shareId/revoke/:userId', revokeAccess);

export default router;
