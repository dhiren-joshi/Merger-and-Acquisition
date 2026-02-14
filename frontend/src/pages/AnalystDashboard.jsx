import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import dealService from '../services/dealService';
import authService from '../services/authService';
import AssignmentStatusBadge from '../components/dashboard/AssignmentStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getFitScoreColor } from '../utils/constants';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { toast } from 'react-toastify';

export default function AnalystDashboard() {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    useEffect(() => {
        // Redirect if not analyst
        if (!authService.isAnalyst()) {
            navigate('/dashboard');
            return;
        }
        fetchAssignedDeals();
    }, []);

    const fetchAssignedDeals = async () => {
        try {
            setLoading(true);
            const response = await dealService.getDeals();
            const assignedDeals = response.data.deals;

            setDeals(assignedDeals);

            // Calculate stats
            setStats({
                total: assignedDeals.length,
                pending: assignedDeals.filter(d => d.assignmentStatus === 'Pending' || d.assignmentStatus === 'Reassigned').length,
                inProgress: assignedDeals.filter(d => d.assignmentStatus === 'In Progress').length,
                completed: assignedDeals.filter(d => d.assignmentStatus === 'Completed').length
            });
        } catch (error) {
            console.error('Error fetching deals:', error);
            toast.error('Failed to load assigned deals');
        } finally {
            setLoading(false);
        }
    };

    const handleDealClick = (dealId) => {
        navigate(`/deals/${dealId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <LoadingSpinner className="flex-1 py-20" size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Assigned Deals</h1>
                        <p className="text-gray-600 mt-2">
                            Track and manage your deal assignments
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={ClipboardCheck}
                            label="Total Assigned"
                            value={stats.total}
                            color="bg-blue-500"
                        />
                        <StatCard
                            icon={Clock}
                            label="Pending"
                            value={stats.pending}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="In Progress"
                            value={stats.inProgress}
                            color="bg-orange-500"
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Completed"
                            value={stats.completed}
                            color="bg-green-500"
                        />
                    </div>

                    {/* Deals List */}
                    {deals.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Deals Assigned Yet
                            </h3>
                            <p className="text-gray-500">
                                Your manager will assign deals to you. Check back later!
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Target Company
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Deal Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fit Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assigned By
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Updated
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {deals.map((deal) => {
                                            const fitScore = deal.fitScore?.adjustedFitScore || 0;
                                            const color = getFitScoreColor(fitScore);

                                            return (
                                                <tr
                                                    key={deal._id}
                                                    onClick={() => handleDealClick(deal._id)}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {deal.targetCompanyName}
                                                        </div>
                                                        {deal.dealValue && (
                                                            <div className="text-sm text-gray-500">
                                                                {formatCurrency(deal.dealValue)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                                                            {deal.dealType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <TrendingUp className="w-4 h-4 mr-1" style={{ color }} />
                                                            <span className="text-lg font-bold" style={{ color }}>
                                                                {Math.round(fitScore)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                        <AssignmentStatusBadge deal={deal} onUpdate={fetchAssignedDeals} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {deal.currentStage}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {deal.assignedBy ? (
                                                            `${deal.assignedBy.firstName} ${deal.assignedBy.lastName}`
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatRelativeTime(deal.updatedAt)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
                <div className={`${color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}
