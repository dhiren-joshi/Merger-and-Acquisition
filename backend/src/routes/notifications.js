import express from 'express';
import { protect } from '../middleware/auth.js';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

// Get user's notifications
router.get('/', protect, notificationController.getNotifications);

// Get unread count
router.get('/unread-count', protect, notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', protect, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', protect, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', protect, notificationController.deleteNotification);

export default router;


