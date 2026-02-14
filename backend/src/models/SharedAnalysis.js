import mongoose from 'mongoose';

const sharedAnalysisSchema = new mongoose.Schema({
    // Source Deal
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal',
        required: true
    },

    // Sharing Details
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sharedAt: {
            type: Date,
            default: Date.now
        },
        accessLevel: {
            type: String,
            enum: ['view', 'comment'],
            default: 'view'
        },
        revokedAt: {
            type: Date
        }
    }],

    // Version Tracking
    snapshotData: {
        fitScore: mongoose.Schema.Types.Mixed,
        dealValue: Number,
        dealType: String,
        targetCompanyName: String,
        currentStage: String,
        snapshotDate: {
            type: Date,
            default: Date.now
        }
    },

    // Metadata
    shareMessage: {
        type: String,
        maxLength: 500
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
sharedAnalysisSchema.index({ dealId: 1 });
sharedAnalysisSchema.index({ sharedBy: 1 });
sharedAnalysisSchema.index({ 'sharedWith.userId': 1 });
sharedAnalysisSchema.index({ createdAt: -1 });

// Methods
sharedAnalysisSchema.methods.revokeAccess = function (userId) {
    const userShare = this.sharedWith.find(
        share => share.userId.toString() === userId.toString()
    );
    if (userShare) {
        userShare.revokedAt = new Date();
    }
    return this.save();
};

sharedAnalysisSchema.methods.hasAccess = function (userId) {
    const userShare = this.sharedWith.find(
        share => share.userId.toString() === userId.toString()
    );
    return userShare && !userShare.revokedAt;
};

const SharedAnalysis = mongoose.model('SharedAnalysis', sharedAnalysisSchema);

export default SharedAnalysis;
