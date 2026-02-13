import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import dealService from '../services/dealService';
import { toast } from 'react-toastify';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await dealService.getPipelineAnalytics();

            // Transform backend response to match frontend expectations
            const data = response.data;

            // Convert dealsByStage array to object
            const dealsByStage = {};
            data.dealsByStage?.forEach(stage => {
                dealsByStage[stage._id] = stage.count;
            });

            // Convert distribution to fit score categories
            const fitScoreDistribution = {};
            data.distribution?.forEach(bucket => {
                let category;
                if (bucket._id === 0) category = 'Poor Fit';
                else if (bucket._id === 20) category = 'Weak Fit';
                else if (bucket._id === 40) category = 'Moderate Fit';
                else if (bucket._id === 60) category = 'Good Fit';
                else if (bucket._id === 80) category = 'Strong Fit';
                else category = 'Other';

                fitScoreDistribution[category] = bucket.count;
            });

            // Calculate total deals
            const totalDeals = Object.values(dealsByStage).reduce((sum, count) => sum + count, 0);

            setAnalytics({
                totalDeals,
                averageFitScore: data.avgFitScore || 0,
                dealsByStage,
                fitScoreDistribution,
                dealTypeDistribution: data.dealTypeDistribution || []
            });
        } catch (error) {
            console.error('Analytics fetch error:', error);
            toast.error('Failed to fetch analytics');
            // Set empty analytics on error
            setAnalytics({
                totalDeals: 0,
                averageFitScore: 0,
                dealsByStage: {},
                fitScoreDistribution: {},
                dealTypeDistribution: []
            });
        } finally {
            setLoading(false);
        }
    };

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

    if (!analytics) {
        return null;
    }

    // Prepare data for charts
    const stageData = Object.entries(analytics.dealsByStage || {}).map(([stage, count]) => ({
        name: stage,
        deals: count
    }));

    const fitScoreData = Object.entries(analytics.fitScoreDistribution || {}).map(([category, count]) => ({
        name: category,
        value: count
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Overview of your M&A pipeline performance
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="card">
                            <div className="text-sm text-gray-600 mb-1">Total Deals</div>
                            <div className="text-3xl font-bold text-gray-900">{analytics.totalDeals || 0}</div>
                        </div>

                        <div className="card">
                            <div className="text-sm text-gray-600 mb-1">Average Fit Score</div>
                            <div className="text-3xl font-bold text-primary-600">
                                {analytics.averageFitScore ? Math.round(analytics.averageFitScore) : 'N/A'}
                            </div>
                        </div>

                        <div className="card">
                            <div className="text-sm text-gray-600 mb-1">Active Deals</div>
                            <div className="text-3xl font-bold text-green-600">
                                {analytics.dealsByStage ? Object.values(analytics.dealsByStage).reduce((a, b) => a + b, 0) : 0}
                            </div>
                        </div>

                        <div className="card">
                            <div className="text-sm text-gray-600 mb-1">High Fit Deals</div>
                            <div className="text-3xl font-bold text-green-600">
                                {(analytics.fitScoreDistribution?.['Strong Fit'] || 0) + (analytics.fitScoreDistribution?.['Good Fit'] || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Deals by Stage */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Deals by Pipeline Stage
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="deals" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Fit Score Distribution */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Fit Score Distribution
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={fitScoreData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {fitScoreData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Deal Type Breakdown */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Pipeline Summary
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stage
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deal Count
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Percentage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stageData.map((stage) => {
                                        const total = stageData.reduce((sum, s) => sum + s.deals, 0);
                                        const percentage = total > 0 ? ((stage.deals / total) * 100).toFixed(1) : 0;
                                        return (
                                            <tr key={stage.name}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {stage.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {stage.deals}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {percentage}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
