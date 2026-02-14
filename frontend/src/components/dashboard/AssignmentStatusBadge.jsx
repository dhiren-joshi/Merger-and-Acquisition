import { ClipboardCheck, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import dealService from '../../services/dealService';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

/**
 * Assignment Status Badge and Update Component
 * Shows current status and allows analysts to update it
 */
export default function AssignmentStatusBadge({ deal, onUpdate }) {
    const isAnalyst = authService.isAnalyst();
    const isAssignedToMe = deal.assignedTo?._id === authService.getCurrentUser()?._id;

    const statusConfig = {
        'Pending': {
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            nextStatus: 'In Progress'
        },
        'In Progress': {
            icon: RefreshCw,
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            nextStatus: 'Completed'
        },
        'Completed': {
            icon: CheckCircle2,
            color: 'bg-green-100 text-green-800 border-green-200',
            nextStatus: null
        },
        'Reassigned': {
            icon: Clock,
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            nextStatus: 'In Progress'
        }
    };

    const config = statusConfig[deal.assignmentStatus] || statusConfig['Pending'];
    const Icon = config.icon;

    const handleUpdateStatus = async () => {
        if (!config.nextStatus) return;

        try {
            await dealService.updateAssignmentStatus(deal._id, config.nextStatus);
            toast.success(`Status updated to ${config.nextStatus}`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update status');
        }
    };

    if (!deal.assignedTo) return null;

    return (
        <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                <span>{deal.assignmentStatus || 'Pending'}</span>
            </div>

            {isAnalyst && isAssignedToMe && config.nextStatus && (
                <button
                    onClick={handleUpdateStatus}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    title={`Mark as ${config.nextStatus}`}
                >
                    → {config.nextStatus}
                </button>
            )}
        </div>
    );
}
