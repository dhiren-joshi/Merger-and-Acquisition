import { getFitScoreColor, getFitScoreCategory } from '../../utils/constants';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { Draggable } from '@hello-pangea/dnd';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DealCard({ deal, index }) {
    const navigate = useNavigate();
    const fitScore = deal.fitScore?.adjustedFitScore || 0;
    const color = getFitScoreColor(fitScore);
    const category = getFitScoreCategory(fitScore);

    const handleClick = () => {
        navigate(`/deals/${deal._id}`);
    };

    return (
        <Draggable draggableId={deal._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={handleClick}
                    className={`bg-white rounded-lg shadow-md p-4 mb-3 cursor-pointer hover:shadow-lg transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-400' : ''
                        }`}
                >
                    {/* Company Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                        {deal.targetCompanyName}
                    </h3>

                    {/* Deal Type Badge */}
                    <div className="mb-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                            {deal.dealType}
                        </span>
                    </div>

                    {/* Fit Score */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Fit Score</span>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4" style={{ color }} />
                                <span className="text-2xl font-bold" style={{ color }}>
                                    {Math.round(fitScore)}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">{category}</p>
                    </div>

                    {/* Metric Breakdown */}
                    {deal.fitScore?.metricBreakdown && (
                        <div className="space-y-2 mb-3">
                            {Object.entries(deal.fitScore.metricBreakdown).map(([key, value]) => (
                                <div key={key} className="flex items-center">
                                    <span className="text-xs text-gray-600 w-20 capitalize">
                                        {key === 'industryMatch' ? 'Industry' : key}
                                    </span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${(value.input || 0) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2 w-8 text-right">
                                        {Math.round((value.input || 0) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Deal Value */}
                    {deal.dealValue && (
                        <div className="mb-2">
                            <p className="text-sm text-gray-600">
                                Value: <span className="font-semibold">{formatCurrency(deal.dealValue)}</span>
                            </p>
                        </div>
                    )}

                    {/* Assigned To */}
                    {deal.assignedTo && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs mr-2">
                                {deal.assignedTo.firstName[0]}{deal.assignedTo.lastName[0]}
                            </div>
                            <span>{deal.assignedTo.firstName} {deal.assignedTo.lastName}</span>
                        </div>
                    )}

                    {/* Last Updated */}
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                        Updated {formatRelativeTime(deal.updatedAt)}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
