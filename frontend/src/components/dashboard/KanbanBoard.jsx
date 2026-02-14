import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import DealCard from './DealCard';
import dealService from '../../services/dealService';
import { DEAL_STAGES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

export default function KanbanBoard({ onCreateDealClick }) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        dealType: '',
        fitScoreMin: '',
        fitScoreMax: '',
        search: ''
    });

    // Fetch deals
    useEffect(() => {
        fetchDeals();
    }, [filters]);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.dealType) params.dealType = filters.dealType;
            if (filters.fitScoreMin) params.fitScoreMin = filters.fitScoreMin;
            if (filters.fitScoreMax) params.fitScoreMax = filters.fitScoreMax;
            if (filters.search) params.search = filters.search;

            const response = await dealService.getDeals(params);
            setDeals(response.data.deals);
        } catch (error) {
            toast.error('Failed to fetch deals');
        } finally {
            setLoading(false);
        }
    };

    // Handle drag end
    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside the list
        if (!destination) return;

        // Dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newStage = destination.droppableId;
        const dealId = draggableId;

        try {
            // Optimistic update
            setDeals(prevDeals =>
                prevDeals.map(deal =>
                    deal._id === dealId ? { ...deal, currentStage: newStage } : deal
                )
            );

            // Update on server
            await dealService.updateDealStage(dealId, newStage);
            toast.success('Deal stage updated');
        } catch (error) {
            toast.error('Failed to update deal stage');
            // Revert on error
            fetchDeals();
        }
    };

    // Get deals by stage
    const getDealsByStage = (stage) => {
        return deals.filter(deal => deal.currentStage === stage);
    };

    if (loading) {
        return <LoadingSpinner className="py-20" size="lg" />;
    }

    return (
        <div>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search deals..."
                        className="input"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <select
                        className="input"
                        value={filters.dealType}
                        onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}
                    >
                        <option value="">All Deal Types</option>
                        <option value="Tech Acquisition">Tech Acquisition</option>
                        <option value="Market Expansion">Market Expansion</option>
                        <option value="Talent Acquisition">Talent Acquisition</option>
                        <option value="Distressed Buy">Distressed Buy</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Min Fit Score"
                        className="input"
                        value={filters.fitScoreMin}
                        onChange={(e) => setFilters({ ...filters, fitScoreMin: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Max Fit Score"
                        className="input"
                        value={filters.fitScoreMax}
                        onChange={(e) => setFilters({ ...filters, fitScoreMax: e.target.value })}
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.values(DEAL_STAGES).map((stage) => {
                        const stageDeals = getDealsByStage(stage);
                        return (
                            <div key={stage} className="bg-gray-100 rounded-lg p-4">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-gray-900 text-lg">
                                        {stage}
                                        <span className="ml-2 text-sm text-gray-500">({stageDeals.length})</span>
                                    </h2>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`min-h-[500px] custom-scrollbar overflow-y-auto ${snapshot.isDraggingOver ? 'bg-primary-50' : ''
                                                }`}
                                        >
                                            {stageDeals.map((deal, index) => (
                                                <DealCard
                                                    key={deal._id}
                                                    deal={deal}
                                                    index={index}
                                                    onUpdate={fetchDeals}
                                                />
                                            ))}
                                            {provided.placeholder}

                                            {/* Empty State */}
                                            {stageDeals.length === 0 && (
                                                <div className="text-center py-12 text-gray-400">
                                                    <p className="text-sm">No deals in this stage</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Floating Action Button */}
            <button
                onClick={onCreateDealClick}
                className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 flex items-center justify-center transition-transform hover:scale-110"
                title="Create New Deal"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
