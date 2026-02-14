import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Get activity logs for a specific deal
 * @route   GET /api/activity/deal/:dealId
 * @access  Private
 */
export const getDealActivity = async (req, res) => {
    try {
        const { dealId } = req.params;
        const { limit = 50, skip = 0 } = req.query;

        const activities = await ActivityLog.find({
            targetId: dealId,
            targetType: 'Deal'
        })
            .populate('userId', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await ActivityLog.countDocuments({
            targetId: dealId,
            targetType: 'Deal'
        });

        res.json({
            status: 'success',
            data: {
                activities,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    hasMore: total > (parseInt(skip) + activities.length)
                }
            }
        });
    } catch (error) {
        console.error('Get deal activity error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch activity logs'
        });
    }
};

/**
 * @desc    Get user's recent activity
 * @route   GET /api/activity/user
 * @access  Private
 */
export const getUserActivity = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const activities = await ActivityLog.find({
            userId: req.userId
        })
            .populate('targetId')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            status: 'success',
            data: { activities }
        });
    } catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user activity'
        });
    }
};

/**
 * @desc    Get team activity (for managers)
 * @route   GET /api/activity/team
 * @access  Private (Manager only)
 */
export const getTeamActivity = async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        // Get recent activities from all users
        const activities = await ActivityLog.find({
            action: { $in: ['deal_created', 'deal_assigned', 'assignment_status_updated', 'analysis_shared'] }
        })
            .populate('userId', 'firstName lastName email role')
            .populate('targetId')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            status: 'success',
            data: { activities }
        });
    } catch (error) {
        console.error('Get team activity error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch team activity'
        });
    }
};
