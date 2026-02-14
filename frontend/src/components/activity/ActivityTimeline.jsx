import { useState, useEffect } from 'react';
import { Clock, User, TrendingUp, AlertCircle } from 'lucide-react';
import activityService from '../../services/activityService';
import { formatRelativeTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ActivityTimeline({ dealId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        if (dealId) {
            fetchActivities();
        }
    }, [dealId]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await activityService.getDealActivity(dealId);
            setActivities(response.data.activities || []);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (action) => {
        const iconMap = {
            deal_created: TrendingUp,
            deal_updated: AlertCircle,
            deal_stage_changed: TrendingUp,
            deal_assigned: User,
            deal_reassigned: User,
            assignment_status_updated: Clock,
            analysis_shared: User,
            share_revoked: AlertCircle
        };
        return iconMap[action] || Clock;
    };

    const getActivityColor = (action) => {
        const colorMap = {
            deal_created: 'text-green-600 bg-green-100',
            deal_assigned: 'text-blue-600 bg-blue-100',
            deal_reassigned: 'text-yellow-600 bg-yellow-100',
            assignment_status_updated: 'text-purple-600 bg-purple-100',
            analysis_shared: 'text-indigo-600 bg-indigo-100',
            share_revoked: 'text-red-600 bg-red-100'
        };
        return colorMap[action] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return <LoadingSpinner size="md" />;
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No activity yet</p>
            </div>
        );
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {activities.map((activity, idx) => {
                    const Icon = getActivityIcon(activity.action);
                    const colorClasses = getActivityColor(activity.action);
                    const isLast = idx === activities.length - 1;

                    return (
                        <li key={activity._id}>
                            <div className="relative pb-8">
                                {!isLast && (
                                    <span
                                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative flex items-start space-x-3">
                                    <div className="relative">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${colorClasses}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">
                                                    {activity.userId?.firstName} {activity.userId?.lastName}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-600">
                                                {activity.description}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {formatRelativeTime(activity.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {pagination?.hasMore && (
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                        Showing {activities.length} of {pagination.total} activities
                    </p>
                </div>
            )}
        </div>
    );
}
