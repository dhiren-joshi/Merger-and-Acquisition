import Deal from '../models/Deal.js';
import mongoose from 'mongoose';

/**
 * Get pipeline analytics
 * GET /api/analytics/pipeline
 */
export const getPipelineAnalytics = async (req, res) => {
    try {
        console.log('Analytics request - User ID:', req.userId, 'Role:', req.user.role);

        // Convert userId to ObjectId for MongoDB aggregate queries
        const userId = new mongoose.Types.ObjectId(req.userId);

        // Build role-based match filter (same logic as getDeals)
        let matchFilter = {};
        if (req.user.role === 'Manager') {
            // Managers see deals they created or assigned
            matchFilter = {
                $or: [
                    { createdBy: userId },
                    { assignedBy: userId }
                ]
            };
        } else if (req.user.role === 'Analyst') {
            // Analysts only see deals assigned to them
            matchFilter = { assignedTo: userId };
        }

        // Get total deals for this user (debug)
        const totalDeals = await Deal.countDocuments(matchFilter);
        console.log('Total deals for user:', totalDeals);

        // Get deals by stage
        const dealsByStage = await Deal.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$currentStage',
                    count: { $sum: 1 },
                    avgFitScore: { $avg: '$fitScore.adjustedFitScore' }
                }
            }
        ]);

        // Get overall average fit score
        const avgFitScore = await Deal.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$fitScore.adjustedFitScore' }
                }
            }
        ]);

        // Get fit score distribution
        const distribution = await Deal.aggregate([
            { $match: matchFilter },
            {
                $bucket: {
                    groupBy: '$fitScore.adjustedFitScore',
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: 'Other',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        // Get deal type distribution
        const dealTypeDistribution = await Deal.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$dealType',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('Analytics results:', {
            dealsByStage: dealsByStage.length,
            avgFitScore: avgFitScore[0]?.avgScore || 0,
            distribution: distribution.length,
            dealTypeDistribution: dealTypeDistribution.length
        });

        res.status(200).json({
            status: 'success',
            data: {
                dealsByStage,
                avgFitScore: avgFitScore[0]?.avgScore || 0,
                distribution,
                dealTypeDistribution
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching analytics'
        });
    }
};
