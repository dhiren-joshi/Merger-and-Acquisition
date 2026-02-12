import Deal from '../models/Deal.js';
import fitScoreService from '../services/fitScoreService.js';

/**
 * Get all deals with filtering and sorting
 * GET /api/deals
 */
export const getDeals = async (req, res) => {
    try {
        const {
            stage,
            dealType,
            fitScoreMin,
            fitScoreMax,
            search,
            sortBy = '-createdAt',
            limit = 50,
            offset = 0
        } = req.query;

        // Build query
        const query = { createdBy: req.userId };

        if (stage) {
            query.currentStage = stage;
        }

        if (dealType) {
            query.dealType = dealType;
        }

        if (fitScoreMin || fitScoreMax) {
            query['fitScore.adjustedFitScore'] = {};
            if (fitScoreMin) query['fitScore.adjustedFitScore'].$gte = Number(fitScoreMin);
            if (fitScoreMax) query['fitScore.adjustedFitScore'].$lte = Number(fitScoreMax);
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query
        const deals = await Deal.find(query)
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email')
            .sort(sortBy)
            .limit(Number(limit))
            .skip(Number(offset));

        const total = await Deal.countDocuments(query);

        res.status(200).json({
            status: 'success',
            data: {
                deals,
                total,
                page: Math.floor(Number(offset) / Number(limit)) + 1,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get deals error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching deals'
        });
    }
};

/**
 * Get single deal by ID
 * GET /api/deals/:dealId
 */
export const getDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.dealId)
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email')
            .populate('notes.createdBy', 'firstName lastName');

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check ownership
        if (deal.createdBy._id.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to access this deal'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { deal }
        });
    } catch (error) {
        console.error('Get deal error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching deal'
        });
    }
};

/**
 * Create new deal
 * POST /api/deals
 */
export const createDeal = async (req, res) => {
    try {
        const dealData = req.body;

        // Calculate fit score
        const fitScoreResult = fitScoreService.calculateFitScore(dealData, dealData.customWeights);

        // Create deal with fit score
        const deal = await Deal.create({
            ...dealData,
            fitScore: fitScoreResult,
            createdBy: req.userId
        });

        const populatedDeal = await Deal.findById(deal._id)
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            status: 'success',
            data: {
                deal: populatedDeal,
                fitScore: fitScoreResult
            }
        });
    } catch (error) {
        console.error('Create deal error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error creating deal'
        });
    }
};

/**
 * Update deal
 * PUT /api/deals/:dealId
 */
export const updateDeal = async (req, res) => {
    try {
        let deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check ownership
        if (deal.createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this deal'
            });
        }

        // If deal data changes, recalculate fit score
        const dealData = { ...deal.toObject(), ...req.body };
        const fitScoreResult = fitScoreService.calculateFitScore(dealData, dealData.customWeights);

        // Update deal
        deal = await Deal.findByIdAndUpdate(
            req.params.dealId,
            { ...req.body, fitScore: fitScoreResult },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            status: 'success',
            data: { deal }
        });
    } catch (error) {
        console.error('Update deal error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating deal'
        });
    }
};

/**
 * Delete deal
 * DELETE /api/deals/:dealId
 */
export const deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check ownership
        if (deal.createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this deal'
            });
        }

        await deal.deleteOne();

        res.status(200).json({
            status: 'success',
            message: 'Deal deleted successfully'
        });
    } catch (error) {
        console.error('Delete deal error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting deal'
        });
    }
};

/**
 * Update deal stage (for Kanban drag-drop)
 * PATCH /api/deals/:dealId/stage
 */
export const updateDealStage = async (req, res) => {
    try {
        const { stage } = req.body;

        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check ownership
        if (deal.createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this deal'
            });
        }

        deal.currentStage = stage;
        await deal.save();

        res.status(200).json({
            status: 'success',
            data: { deal }
        });
    } catch (error) {
        console.error('Update stage error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating deal stage'
        });
    }
};

/**
 * Add note to deal
 * POST /api/deals/:dealId/notes
 */
export const addNote = async (req, res) => {
    try {
        const { content } = req.body;

        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        deal.notes.push({
            content,
            createdBy: req.userId
        });

        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('notes.createdBy', 'firstName lastName');

        res.status(201).json({
            status: 'success',
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding note'
        });
    }
};

/**
 * Delete note from deal
 * DELETE /api/deals/:dealId/notes/:noteId
 */
export const deleteNote = async (req, res) => {
    try {
        const { dealId, noteId } = req.params;

        const deal = await Deal.findById(dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Find the note
        const noteIndex = deal.notes.findIndex(
            note => note._id.toString() === noteId
        );

        if (noteIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Note not found'
            });
        }

        // Check if user owns the note
        if (deal.notes[noteIndex].createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this note'
            });
        }

        // Remove the note
        deal.notes.splice(noteIndex, 1);
        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('notes.createdBy', 'firstName lastName');

        res.status(200).json({
            status: 'success',
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting note'
        });
    }
};

