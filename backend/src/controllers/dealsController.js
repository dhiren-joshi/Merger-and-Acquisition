import Deal from '../models/Deal.js';
import fitScoreService from '../services/fitScoreService.js';
import User from '../models/User.js';
import { ASSIGNMENT_STATUS } from '../utils/constants.js';

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

        // Build filter conditions as an array for $and
        const conditions = [];

        // Role-based access filter
        if (req.user.role === 'Manager') {
            // Managers see all deals they created or assigned
            conditions.push({
                $or: [
                    { createdBy: req.userId },
                    { assignedBy: req.userId }
                ]
            });
        } else if (req.user.role === 'Analyst') {
            // Analysts only see deals assigned to them
            conditions.push({ assignedTo: req.userId });
        }

        if (stage) {
            conditions.push({ currentStage: stage });
        }

        if (dealType) {
            conditions.push({ dealType });
        }

        if (fitScoreMin || fitScoreMax) {
            const scoreFilter = {};
            if (fitScoreMin) scoreFilter.$gte = Number(fitScoreMin);
            if (fitScoreMax) scoreFilter.$lte = Number(fitScoreMax);
            conditions.push({ 'fitScore.adjustedFitScore': scoreFilter });
        }

        if (search) {
            conditions.push({ $text: { $search: search } });
        }

        // Build final query — use $and only if multiple conditions exist
        const query = conditions.length > 1
            ? { $and: conditions }
            : conditions.length === 1
                ? conditions[0]
                : {};

        // Execute query
        const deals = await Deal.find(query)
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role')
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
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role')
            .populate('notes.createdBy', 'firstName lastName');

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check access: Manager (owner or assigner) or Analyst (assignee)
        const isManager = req.user.role === 'Manager';
        // After populate(), fields are objects with _id, not plain ObjectIds
        const isOwner = deal.createdBy?._id?.toString() === req.userId;
        const isAssigner = deal.assignedBy?._id?.toString() === req.userId;
        const isAssignee = deal.assignedTo?._id?.toString() === req.userId;

        if (!isManager && !isAssignee) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to access this deal'
            });
        }

        if (isManager && !isOwner && !isAssigner) {
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
        console.log('Creating deal with data:', JSON.stringify(dealData, null, 2));

        // Calculate fit score
        console.log('Calculating fit score...');
        const fitScoreResult = fitScoreService.calculateFitScore(dealData, dealData.customWeights);
        console.log('Fit Score Result:', JSON.stringify(fitScoreResult, null, 2));

        // Create deal with fit score
        const deal = await Deal.create({
            ...dealData,
            fitScore: fitScoreResult,
            createdBy: req.userId
        });

        const populatedDeal = await Deal.findById(deal._id)
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role');

        res.status(201).json({
            status: 'success',
            data: {
                deal: populatedDeal,
                fitScore: fitScoreResult
            }
        });
    } catch (error) {
        console.error('Create deal error details:', error);

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                status: 'error',
                message: `Validation Error: ${messages.join(', ')}`
            });
        }

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
        ).populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role');

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

/**
 * Assign deal to an analyst (Manager only)
 * POST /api/deals/:dealId/assign
 */
export const assignDeal = async (req, res) => {
    try {
        const { analystId } = req.body;

        // Validate analyst exists and is an Analyst role
        const analyst = await User.findById(analystId);
        if (!analyst) {
            return res.status(404).json({
                status: 'error',
                message: 'Analyst not found'
            });
        }

        if (analyst.role !== 'Analyst') {
            return res.status(400).json({
                status: 'error',
                message: 'User is not an Analyst'
            });
        }

        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Only deal creator can assign
        if (deal.createdBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Only the deal creator can assign this deal'
            });
        }

        // Update assignment fields
        deal.assignedTo = analystId;
        deal.assignedBy = req.userId;
        deal.assignedAt = new Date();
        deal.assignmentStatus = ASSIGNMENT_STATUS.PENDING;

        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role');

        res.status(200).json({
            status: 'success',
            message: `Deal assigned to ${analyst.firstName} ${analyst.lastName}`,
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Assign deal error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error assigning deal'
        });
    }
};

/**
 * Reassign deal to another analyst (Manager only)
 * PATCH /api/deals/:dealId/reassign
 */
export const reassignDeal = async (req, res) => {
    try {
        const { analystId } = req.body;

        // Validate analyst exists and is an Analyst role
        const analyst = await User.findById(analystId);
        if (!analyst) {
            return res.status(404).json({
                status: 'error',
                message: 'Analyst not found'
            });
        }

        if (analyst.role !== 'Analyst') {
            return res.status(400).json({
                status: 'error',
                message: 'User is not an Analyst'
            });
        }

        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Only original assigner or creator can reassign
        const isCreator = deal.createdBy.toString() === req.userId;
        const isAssigner = deal.assignedBy?.toString() === req.userId;

        if (!isCreator && !isAssigner) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to reassign this deal'
            });
        }

        // Update assignment fields
        deal.assignedTo = analystId;
        deal.assignedBy = req.userId;
        deal.assignedAt = new Date();
        deal.assignmentStatus = ASSIGNMENT_STATUS.REASSIGNED;

        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role');

        res.status(200).json({
            status: 'success',
            message: `Deal reassigned to ${analyst.firstName} ${analyst.lastName}`,
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Reassign deal error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error reassigning deal'
        });
    }
};

/**
 * Update assignment status (Analyst can update their own assignment status)
 * PATCH /api/deals/:dealId/assignment-status
 */
export const updateAssignmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!Object.values(ASSIGNMENT_STATUS).includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid assignment status'
            });
        }

        const deal = await Deal.findById(req.params.dealId);

        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Only assigned analyst can update status
        if (deal.assignedTo?.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update assignment status'
            });
        }

        deal.assignmentStatus = status;
        await deal.save();

        const populatedDeal = await Deal.findById(deal._id)
            .populate('assignedTo', 'firstName lastName email role')
            .populate('assignedBy', 'firstName lastName email role')
            .populate('createdBy', 'firstName lastName email role');

        res.status(200).json({
            status: 'success',
            message: 'Assignment status updated',
            data: { deal: populatedDeal }
        });
    } catch (error) {
        console.error('Update assignment status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating assignment status'
        });
    }
};
