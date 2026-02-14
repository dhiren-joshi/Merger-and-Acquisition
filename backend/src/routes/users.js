import express from 'express';
import { getUsers, getAnalysts } from '../controllers/usersController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes protected
router.use(protect);

// User routes
router.get('/', getUsers);
router.get('/analysts', getAnalysts);

export default router;
