import { useState, useEffect } from 'react';
import { Users, UserCheck } from 'lucide-react';
import api from '../../services/api';
import dealService from '../../services/dealService';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

/**
 * Assignment Dropdown Component
 * Allows managers to assign deals to analysts
 */
export default function AssignmentDropdown({ deal, onAssign }) {
    const [analysts, setAnalysts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const isManager = authService.isManager();

    // Fetch analysts when dropdown opens
    useEffect(() => {
        if (showDropdown && analysts.length === 0) {
            fetchAnalysts();
        }
    }, [showDropdown]);

    const fetchAnalysts = async () => {
        try {
            setLoading(true);
            // Fetch all users and filter analysts on frontend
            const response = await api.get('/users'); // You'll need to create this endpoint
            const analystsList = response.data.data.users.filter(u => u.role === 'Analyst');
            setAnalysts(analystsList);
        } catch (error) {
            console.error('Error fetching analysts:', error);
            toast.error('Failed to load analysts');
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (analystId) => {
        try {
            setLoading(true);
            if (deal.assignedTo?._id) {
                // Reassign
                await dealService.reassignDeal(deal._id, analystId);
                toast.success('Deal reassigned successfully');
            } else {
                // First assignment
                await dealService.assignDeal(deal._id, analystId);
                toast.success('Deal assigned successfully');
            }
            setShowDropdown(false);
            if (onAssign) onAssign();
        } catch (error) {
            console.error('Assignment error:', error);
            toast.error(error.response?.data?.message || 'Failed to assign deal');
        } finally {
            setLoading(false);
        }
    };

    if (!isManager) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                disabled={loading}
            >
                {deal.assignedTo ? (
                    <>
                        <UserCheck className="w-4 h-4" />
                        <span>{deal.assignedTo.firstName} {deal.assignedTo.lastName}</span>
                    </>
                ) : (
                    <>
                        <Users className="w-4 h-4" />
                        <span>Assign</span>
                    </>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-2 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                                {deal.assignedTo ? 'Reassign to' : 'Assign to'}
                            </p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    Loading analysts...
                                </div>
                            ) : analysts.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No analysts available
                                </div>
                            ) : (
                                analysts.map(analyst => (
                                    <button
                                        key={analyst._id}
                                        onClick={() => handleAssign(analyst._id)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${deal.assignedTo?._id === analyst._id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                                            }`}
                                        disabled={loading}
                                    >
                                        <div className="font-medium">{analyst.firstName} {analyst.lastName}</div>
                                        <div className="text-xs text-gray-500">{analyst.email}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
