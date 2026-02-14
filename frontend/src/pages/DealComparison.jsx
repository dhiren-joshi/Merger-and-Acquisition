import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, X, Download } from 'lucide-react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ComparisonRadarChart from '../components/comparison/ComparisonRadarChart';
import ComparisonTable from '../components/comparison/ComparisonTable';
import dealService from '../services/dealService';
import { exportComparisonToPDF, exportComparisonWithCharts } from '../services/comparisonExportService';

export default function DealComparison() {
    const navigate = useNavigate();
    const [allDeals, setAllDeals] = useState([]);
    const [selectedDeals, setSelectedDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const response = await dealService.getDeals();
            setAllDeals(response.data.deals || []);
        } catch (error) {
            toast.error('Failed to fetch deals');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeal = (dealId) => {
        if (selectedDeals.length >= 5) {
            toast.warning('Maximum 5 deals can be compared at once');
            return;
        }

        const deal = allDeals.find(d => d._id === dealId);
        if (deal && !selectedDeals.find(d => d._id === dealId)) {
            setSelectedDeals([...selectedDeals, deal]);
        }
    };

    const handleRemoveDeal = (dealId) => {
        setSelectedDeals(selectedDeals.filter(d => d._id !== dealId));
    };

    const handleExportPDF = async () => {
        try {
            setExporting(true);
            await exportComparisonToPDF(selectedDeals);
            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    const handleExportWithCharts = async () => {
        try {
            setExporting(true);
            await exportComparisonWithCharts(selectedDeals);
            toast.success('PDF with charts exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export PDF with charts');
        } finally {
            setExporting(false);
        }
    };

    const availableDeals = allDeals.filter(
        deal => !selectedDeals.find(d => d._id === deal._id)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <div className="flex-1">
                        <LoadingSpinner className="py-20" size="lg" />
                    </div>
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
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Deal Comparison</h1>
                            <p className="text-gray-600 mt-2">
                                Compare multiple deals side-by-side to identify the best opportunities
                            </p>
                        </div>

                        {selectedDeals.length >= 2 && (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleExportPDF}
                                    disabled={exporting}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
                                </button>
                                <button
                                    onClick={handleExportWithCharts}
                                    disabled={exporting}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>{exporting ? 'Exporting...' : 'PDF with Charts'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Deal Selection */}
                    <div className="card mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Select Deals to Compare ({selectedDeals.length}/5)
                        </h2>

                        {/* Selected Deals */}
                        {selectedDeals.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Selected:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDeals.map(deal => (
                                        <div
                                            key={deal._id}
                                            className="flex items-center space-x-2 bg-primary-100 text-primary-800 px-3 py-2 rounded-md"
                                        >
                                            <span className="font-medium">{deal.targetCompanyName}</span>
                                            <button
                                                onClick={() => handleRemoveDeal(deal._id)}
                                                className="hover:text-primary-900"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Deals */}
                        {availableDeals.length > 0 ? (
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Available deals:</p>
                                <select
                                    onChange={(e) => handleAddDeal(e.target.value)}
                                    value=""
                                    className="input"
                                    disabled={selectedDeals.length >= 5}
                                >
                                    <option value="">Select a deal to add...</option>
                                    {availableDeals.map(deal => (
                                        <option key={deal._id} value={deal._id}>
                                            {deal.targetCompanyName} - Fit Score: {Math.round(deal.fitScore?.adjustedFitScore || 0)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {selectedDeals.length > 0
                                    ? 'All available deals have been selected'
                                    : 'No deals available for comparison'}
                            </p>
                        )}
                    </div>

                    {/* Comparison Results */}
                    {selectedDeals.length < 2 ? (
                        <div className="card text-center py-12">
                            <Plus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Select at least 2 deals to compare
                            </h3>
                            <p className="text-gray-600">
                                Choose deals from the dropdown above to see a detailed comparison
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Radar Chart Comparison */}
                            <div className="card mb-6" data-chart="radar">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Metric Comparison (Radar Chart)
                                </h2>
                                <ComparisonRadarChart deals={selectedDeals} />
                            </div>

                            {/* Detailed Table Comparison */}
                            <div className="card" data-table="comparison">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Detailed Comparison
                                </h2>
                                <ComparisonTable deals={selectedDeals} />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
