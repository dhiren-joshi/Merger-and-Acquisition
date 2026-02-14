import express from 'express';
import {
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    addNote,
    deleteNote,
    assignDeal,
    reassignDeal,
    updateAssignmentStatus
} from '../controllers/dealsController.js';
import { protect } from '../middleware/auth.js';
import { requireManager } from '../middleware/roleAuth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Deal routes
router.route('/')
    .get(getDeals)
    .post(createDeal);

router.route('/:dealId')
    .get(getDeal)
    .put(updateDeal)
    .delete(deleteDeal);

router.patch('/:dealId/stage', updateDealStage);

// Assignment routes (Manager only for assign/reassign)
router.post('/:dealId/assign', requireManager, assignDeal);
router.patch('/:dealId/reassign', requireManager, reassignDeal);
router.patch('/:dealId/assignment-status', updateAssignmentStatus); // Analyst can update own status

// Notes routes
router.post('/:dealId/notes', addNote);
router.delete('/:dealId/notes/:noteId', deleteNote);

export default router;

