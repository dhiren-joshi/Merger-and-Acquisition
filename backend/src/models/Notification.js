import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    // Recipient user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Notification type
    type: {
        type: String,
        enum: ['DEAL_ASSIGNED', 'DEAL_SHARED', 'STATUS_UPDATED', 'COMMENT_ADDED', 'DEAL_REASSIGNED'],
        required: true
    },

    // Display content
    title: {
        type: String,
        required: true,
        maxlength: 200
    },

    message: {
        type: String,
        required: true,
        maxlength: 500
    },

    // Related data
    metadata: {
        dealId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deal'
        },
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        actionType: String,
        dealName: String,
        actorName: String
    },

    // Read status
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
    try {
        const notification = new this(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function (notificationId, userId) {
    return this.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
    return this.countDocuments({ userId, isRead: false });
};

// Static method to cleanup old notifications (90 days)
notificationSchema.statics.cleanupOld = async function () {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return this.deleteMany({ createdAt: { $lt: ninetyDaysAgo } });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
