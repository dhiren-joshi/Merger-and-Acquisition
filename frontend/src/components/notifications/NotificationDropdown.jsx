import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';
import NotificationItem from './NotificationItem';
import LoadingSpinner from '../common/LoadingSpinner';

export default function NotificationDropdown({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications(10, 0, false);
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);

            // Update local state
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();

            // Update local state
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );

            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="py-8">
                        <LoadingSpinner size="sm" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onClick={onClose}
                            onMarkRead={handleMarkAsRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
