import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Download, Share2, Edit } from 'lucide-react';
import Header from '../components/common/Header';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CircularGauge from '../components/visualizations/CircularGauge';
import MetricBarChart from '../components/visualizations/MetricBarChart';
import WeightDistributionChart from '../components/visualizations/WeightDistributionChart';
import InsightsCard from '../components/visualizations/InsightsCard';
import NotesSection from '../components/collaboration/NotesSection';
import dealService from '../services/dealService';
import { exportToPDF, exportToJSON } from '../services/exportService';
import { exportToExcel } from '../services/excelExportService';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function DealDetails() {
    const { dealId } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeal();
    }, [dealId]);

    const fetchDeal = async () => {
        try {
            setLoading(true);
            const response = await dealService.getDeal(dealId);
            setDeal(response.data.deal);
        } catch (error) {
            toast.error('Failed to fetch deal details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        try {
            exportToPDF(deal);
            toast.success('PDF exported successfully!');
        } catch (error) {
            toast.error('Failed to export PDF');
        }
    };

    const handleExportExcel = () => {
        try {
            exportToExcel(deal);
            toast.success('Excel file exported successfully!');
        } catch (error) {
            toast.error('Failed to export Excel');
        }
    };

    const handleExportJSON = () => {
        try {
            exportToJSON(deal);
            toast.success('JSON exported successfully!');
        } catch (error) {
            toast.error('Failed to export JSON');
        }
    };

    const handleShare = () => {
        toast.info('Share feature coming soon!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <LoadingSpinner className="py-20" size="lg" />
            </div>
        );
    }

    if (!deal) {
        return null;
    }

    const fitScore = deal.fitScore || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Fit Score Analysis: {deal.targetCompanyName}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {deal.dealName} • {deal.dealType}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleExportPDF}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>PDF</span>
                            </button>
                            <button
                                onClick={handleExportExcel}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Excel</span>
                            </button>
                            <button
                                onClick={handleExportJSON}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>JSON</span>
                            </button>
                            <button
                                onClick={handleShare}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                            <button
                                onClick={() => navigate(`/deals/${dealId}/edit`)}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Circular Gauge */}
                    <div className="card flex items-center justify-center py-8">
                        <CircularGauge score={fitScore.adjustedFitScore} size={220} />
                    </div>

                    {/* Category Interpretation */}
                    <div className="card lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Category Interpretation
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Score</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {Math.round(fitScore.adjustedFitScore || 0)}/100
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Category</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {fitScore.categoryInterpretation || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Recommendation</p>
                                <p className="text-gray-700">
                                    {fitScore.adjustedFitScore >= 81 && "Proceed with confidence. This is a strong strategic fit."}
                                    {fitScore.adjustedFitScore >= 61 && fitScore.adjustedFitScore < 81 && "Proceed with caution. Conduct thorough due diligence."}
                                    {fitScore.adjustedFitScore >= 41 && fitScore.adjustedFitScore < 61 && "Consider carefully. Significant due diligence required."}
                                    {fitScore.adjustedFitScore >= 21 && fitScore.adjustedFitScore < 41 && "High risk. Address significant concerns before proceeding."}
                                    {fitScore.adjustedFitScore < 21 && "Not recommended. Consider alternative opportunities."}
                                </p>
                            </div>

                            {deal.dealValue && (
                                <div>
                                    <p className="text-sm text-gray-600">Deal Value</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {formatCurrency(deal.dealValue)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Insights</h2>
                    <InsightsCard
                        strengths={fitScore.strengths || []}
                        risks={fitScore.risks || []}
                        recommendations={fitScore.recommendations || []}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Metric Comparison Chart */}
                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Metric Comparison
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Raw scores vs. weighted contribution to final Fit Score
                        </p>
                        <MetricBarChart metricBreakdown={fitScore.metricBreakdown} />
                    </div>

                    {/* Weight Distribution Chart */}
                    <div className="card">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Weight Distribution
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Percentage contribution of each metric ({deal.dealType})
                        </p>
                        <WeightDistributionChart weights={fitScore.weights} />
                    </div>
                </div>

                {/* Detailed Data Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Industry Match */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Industry Match
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Target Industry:</span>
                                <span className="font-medium">{deal.industryMatch?.targetIndustry}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Acquirer Industry:</span>
                                <span className="font-medium">{deal.industryMatch?.acquirerIndustry}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Strategic Motive:</span>
                                <span className="font-medium">{deal.industryMatch?.strategicMotive}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Target Market Share:</span>
                                <span className="font-medium">{deal.industryMatch?.targetMarketShare}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Data */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Financial Overview
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Revenue:</span>
                                <span className="font-medium">{formatCurrency(deal.financials?.target?.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">EBITDA:</span>
                                <span className="font-medium">{formatCurrency(deal.financials?.target?.ebitda)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Growth Rate:</span>
                                <span className="font-medium">{deal.financials?.target?.growthRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cash Flow Status:</span>
                                <span className="font-medium">{deal.financials?.target?.cashFlowStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Cultural Data */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cultural & Operational
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Organizational Structure:</span>
                                <span className="font-medium">{deal.cultural?.organizationalStructure}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Management Style:</span>
                                <span className="font-medium">{deal.cultural?.managementStyle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Employee Count:</span>
                                <span className="font-medium">{deal.cultural?.employeeCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Talent Retention Risk:</span>
                                <span className="font-medium">{deal.cultural?.talentRetentionRisk}</span>
                            </div>
                        </div>
                    </div>

                    {/* Technology Data */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Technology Stack
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Infrastructure:</span>
                                <span className="font-medium">{deal.technology?.infrastructureType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Development Methodology:</span>
                                <span className="font-medium">{deal.technology?.developmentMethodology}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Legacy Systems:</span>
                                <span className="font-medium">{deal.technology?.legacySystems ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Modernization Gap:</span>
                                <span className="font-medium">{deal.technology?.modernizationGap}/10</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="mt-6 card">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Created: {formatDate(deal.createdAt)}</span>
                        <span>Last Updated: {formatDate(deal.updatedAt)}</span>
                        <span>Stage: {deal.currentStage}</span>
                    </div>
                </div>

                {/* Notes & Collaboration */}
                <div className="mt-6">
                    <NotesSection deal={deal} onUpdate={fetchDeal} />
                </div>
            </main>
        </div>
    );
}
