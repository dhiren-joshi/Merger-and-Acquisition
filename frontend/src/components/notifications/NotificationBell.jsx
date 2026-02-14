import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import notificationService from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUnreadCount();

        // Poll for unread count every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response.data.count || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Refresh count when opening
            fetchUnreadCount();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Refresh count when closing (in case notifications were read)
        fetchUnreadCount();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <NotificationDropdown
                isOpen={isOpen}
                onClose={handleClose}
            />
        </div>
    );
}
