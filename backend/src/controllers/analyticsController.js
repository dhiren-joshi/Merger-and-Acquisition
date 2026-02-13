import Deal from '../models/Deal.js';
import mongoose from 'mongoose';

/**
 * Get pipeline analytics
 * GET /api/analytics/pipeline
 */
export const getPipelineAnalytics = async (req, res) => {
    try {
        console.log('Analytics request - User ID:', req.userId);

        // Convert userId to ObjectId for MongoDB aggregate queries
        const userId = new mongoose.Types.ObjectId(req.userId);

        // Get total deals for this user (debug)
        const totalDeals = await Deal.countDocuments({ createdBy: userId });
        console.log('Total deals for user:', totalDeals);

        // Get deals by stage
        const dealsByStage = await Deal.aggregate([
            { $match: { createdBy: userId } },
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
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$fitScore.adjustedFitScore' }
                }
            }
        ]);

        // Get fit score distribution
        const distribution = await Deal.aggregate([
            { $match: { createdBy: userId } },
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
            { $match: { createdBy: userId } },
            {
                $group: {
                    _id: '$dealType',
                    count: { $sum: 1 }
                }
            }
        ]);

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
