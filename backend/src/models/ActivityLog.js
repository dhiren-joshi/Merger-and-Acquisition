import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    // Action Details
    action: {
        type: String,
        required: true,
        enum: [
            // Deal actions
            'deal_created',
            'deal_updated',
            'deal_deleted',
            'deal_stage_changed',

            // Assignment actions
            'deal_assigned',
            'deal_reassigned',
            'assignment_status_updated',

            // Sharing actions
            'analysis_shared',
            'share_revoked',

            // User actions
            'user_registered',
            'user_login'
        ]
    },

    // Actor
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Target
    targetType: {
        type: String,
        enum: ['Deal', 'User', 'SharedAnalysis'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },

    // Context
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },

    // Readable description
    description: {
        type: String,
        required: true
    },

    // IP tracking
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Indexes for quick queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ targetId: 1, targetType: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function ({
    action,
    userId,
    targetType,
    targetId,
    description,
    metadata = {},
    ipAddress,
    userAgent
}) {
    return this.create({
        action,
        userId,
        targetType,
        targetId,
        description,
        metadata,
        ipAddress,
        userAgent
    });
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
