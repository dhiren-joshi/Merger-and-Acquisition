import SharedAnalysis from '../models/SharedAnalysis.js';
import Deal from '../models/Deal.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Share a deal analysis
 * @route   POST /api/sharing/share
 * @access  Private
 */
export const shareDealAnalysis = async (req, res) => {
    try {
        const { dealId, userIds, shareMessage, accessLevel = 'view' } = req.body;

        // Validate deal exists and user has access
        const deal = await Deal.findById(dealId);
        if (!deal) {
            return res.status(404).json({
                status: 'error',
                message: 'Deal not found'
            });
        }

        // Check if user owns the deal or is assigned to it
        const canShare = deal.createdBy.toString() === req.userId ||
            deal.assignedTo?.toString() === req.userId;

        if (!canShare) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to share this deal'
            });
        }

        // Validate users exist
        const users = await User.find({ _id: { $in: userIds }, isActive: true });
        if (users.length !== userIds.length) {
            return res.status(400).json({
                status: 'error',
                message: 'One or more users not found'
            });
        }

        // Create snapshot of current deal data
        const snapshotData = {
            fitScore: deal.fitScore,
            dealValue: deal.dealValue,
            dealType: deal.dealType,
            targetCompanyName: deal.targetCompanyName,
            currentStage: deal.currentStage,
            snapshotDate: new Date()
        };

        // Create shared analysis
        const sharedWith = userIds.map(userId => ({
            userId,
            accessLevel,
            sharedAt: new Date()
        }));

        const sharedAnalysis = await SharedAnalysis.create({
            dealId,
            sharedBy: req.userId,
            sharedWith,
            snapshotData,
            shareMessage
        });

        // Log activity
        await ActivityLog.logActivity({
            action: 'analysis_shared',
            userId: req.userId,
            targetType: 'Deal',
            targetId: dealId,
            description: `Shared analysis with ${users.length} user(s)`,
            metadata: { sharedWithCount: users.length }
        });

        // Populate user details
        await sharedAnalysis.populate('sharedWith.userId', 'firstName lastName email');

        res.status(201).json({
            status: 'success',
            data: { sharedAnalysis }
        });
    } catch (error) {
        console.error('Share deal error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to share analysis'
        });
    }
};

/**
 * @desc    Get shared analyses (created by user or shared with user)
 * @route   GET /api/sharing
 * @access  Private
 */
export const getSharedAnalyses = async (req, res) => {
    try {
        const sharedAnalyses = await SharedAnalysis.find({
            $or: [
                { sharedBy: req.userId },
                { 'sharedWith.userId': req.userId, 'sharedWith.revokedAt': null }
            ],
            isActive: true
        })
            .populate('dealId', 'targetCompanyName dealType fitScore')
            .populate('sharedBy', 'firstName lastName email')
            .populate('sharedWith.userId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({
            status: 'success',
            data: { sharedAnalyses }
        });
    } catch (error) {
        console.error('Get shared analyses error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch shared analyses'
        });
    }
};

/**
 * @desc    Revoke access to shared analysis
 * @route   PATCH /api/sharing/:shareId/revoke/:userId
 * @access  Private
 */
export const revokeAccess = async (req, res) => {
    try {
        const { shareId, userId } = req.params;

        const sharedAnalysis = await SharedAnalysis.findById(shareId);
        if (!sharedAnalysis) {
            return res.status(404).json({
                status: 'error',
                message: 'Shared analysis not found'
            });
        }

        // Only the person who shared can revoke
        if (sharedAnalysis.sharedBy.toString() !== req.userId) {
            return res.status(403).json({
                status: 'error',
                message: 'Only the share creator can revoke access'
            });
        }

        await sharedAnalysis.revokeAccess(userId);

        // Log activity
        await ActivityLog.logActivity({
            action: 'share_revoked',
            userId: req.userId,
            targetType: 'SharedAnalysis',
            targetId: shareId,
            description: 'Revoked share access',
            metadata: { revokedUserId: userId }
        });

        res.json({
            status: 'success',
            message: 'Access revoked successfully'
        });
    } catch (error) {
        console.error('Revoke access error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to revoke access'
        });
    }
};
