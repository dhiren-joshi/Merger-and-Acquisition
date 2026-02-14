import { useState, useEffect } from 'react';
import { X, Users, Share2, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import sharingService from '../../services/sharingService';
import dealService from '../../services/dealService';

export default function ShareModal({ deal, isOpen, onClose }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [shareMessage, setShareMessage] = useState('');
    const [accessLevel, setAccessLevel] = useState('view');
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            setFetchingUsers(true);
            const response = await dealService.getUsers();
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setFetchingUsers(false);
        }
    };

    const handleUserToggle = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleShare = async () => {
        if (selectedUsers.length === 0) {
            toast.warning('Please select at least one user to share with');
            return;
        }

        try {
            setLoading(true);
            await sharingService.shareDealAnalysis(
                deal._id,
                selectedUsers,
                shareMessage,
                accessLevel
            );
            toast.success(`Analysis shared with ${selectedUsers.length} user(s)`);
            handleClose();
        } catch (error) {
            console.error('Share error:', error);
            toast.error('Failed to share analysis');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setShareMessage('');
        setAccessLevel('view');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5 text-primary-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Share Analysis: {deal.targetCompanyName}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Access Level */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Level
                        </label>
                        <select
                            value={accessLevel}
                            onChange={(e) => setAccessLevel(e.target.value)}
                            className="input"
                        >
                            <option value="view">View Only</option>
                            <option value="comment">View & Comment</option>
                        </select>
                    </div>

                    {/* Share Message */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message (Optional)
                        </label>
                        <textarea
                            value={shareMessage}
                            onChange={(e) => setShareMessage(e.target.value)}
                            placeholder="Add a note about why you're sharing this analysis..."
                            className="input"
                            rows="3"
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {shareMessage.length}/500 characters
                        </p>
                    </div>

                    {/* User Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Share With
                        </label>

                        {fetchingUsers ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader className="w-6 h-6 animate-spin text-primary-600" />
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {users.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No users available
                                    </div>
                                ) : (
                                    users.map((user) => (
                                        <label
                                            key={user._id}
                                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => handleUserToggle(user._id)}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}

                        {selectedUsers.length > 0 && (
                            <p className="text-sm text-primary-600 mt-2">
                                {selectedUsers.length} user(s) selected
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={loading || selectedUsers.length === 0}
                        className="btn-primary flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>Sharing...</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                <span>Share Analysis</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
