import Notification from '../models/Notification.js';

/**
 * Get user's notifications with pagination
 */
export const getNotifications = async (req, res) => {
    try {
        const { limit = 20, skip = 0, unreadOnly = false } = req.query;
        const userId = req.user._id;

        const query = { userId };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('metadata.actorId', 'name email')
            .populate('metadata.dealId', 'targetCompanyName dealName');

        const total = await Notification.countDocuments(query);

        res.json({
            status: 'success',
            data: {
                notifications,
                total,
                limit: parseInt(limit),
                skip: parseInt(skip)
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch notifications'
        });
    }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Notification.getUnreadCount(userId);

        res.json({
            status: 'success',
            data: { count }
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get unread count'
        });
    }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.markAsRead(id, userId);

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        res.json({
            status: 'success',
            data: { notification }
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to mark notification as read'
        });
    }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await Notification.markAllAsRead(userId);

        res.json({
            status: 'success',
            data: {
                updatedCount: result.modifiedCount
            }
        });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to mark all notifications as read'
        });
    }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            userId
        });

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete notification'
        });
    }
};

