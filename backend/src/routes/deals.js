import express from 'express';
import {
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    addNote,
    deleteNote
} from '../controllers/dealsController.js';
import { protect } from '../middleware/auth.js';

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
router.post('/:dealId/notes', addNote);
router.delete('/:dealId/notes/:noteId', deleteNote);

export default router;

