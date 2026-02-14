import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Share2, AlertCircle, FileText, UserPlus } from 'lucide-react';

export default function NotificationItem({ notification, onClick, onMarkRead }) {
    const navigate = useNavigate();

    const getIcon = (type) => {
        switch (type) {
            case 'DEAL_ASSIGNED':
            case 'DEAL_REASSIGNED':
                return <UserPlus className="w-5 h-5 text-blue-600" />;
            case 'DEAL_SHARED':
                return <Share2 className="w-5 h-5 text-purple-600" />;
            case 'STATUS_UPDATED':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'COMMENT_ADDED':
                return <FileText className="w-5 h-5 text-orange-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleClick = () => {
        // Mark as read if unread
        if (!notification.isRead) {
            onMarkRead(notification._id);
        }

        // Navigate to deal details
        if (notification.metadata?.dealId) {
            navigate(`/deals/${notification.metadata.dealId}`);
        }

        // Close dropdown
        if (onClick) {
            onClick();
        }
    };

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

    return (
        <div
            onClick={handleClick}
            className={`
                px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100
                ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}
            `}
        >
            <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {timeAgo}
                    </p>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
