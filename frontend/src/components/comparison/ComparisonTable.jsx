import { getFitScoreColor, getFitScoreCategory } from '../../utils/constants';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function ComparisonTable({ deals }) {
    if (!deals || deals.length === 0) return null;

    const renderCell = (value, type = 'text') => {
        if (value === null || value === undefined) return <td className="px-4 py-3 text-gray-400">N/A</td>;

        switch (type) {
            case 'currency':
                return <td className="px-4 py-3">{formatCurrency(value)}</td>;
            case 'percentage':
                return <td className="px-4 py-3">{formatPercentage(value)}</td>;
            case 'score':
                const color = getFitScoreColor(value);
                return (
                    <td className="px-4 py-3">
                        <span className="font-bold" style={{ color }}>
                            {Math.round(value)}
                        </span>
                    </td>
                );
            default:
                return <td className="px-4 py-3">{value}</td>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                            Metric
                        </th>
                        {deals.map(deal => (
                            <th
                                key={deal._id}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {deal.targetCompanyName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Fit Score */}
                    <tr className="bg-primary-50">
                        <td className="px-4 py-3 font-semibold text-gray-900 sticky left-0 bg-primary-50 z-10">
                            Overall Fit Score
                        </td>
                        {deals.map(deal => renderCell(deal.fitScore?.adjustedFitScore, 'score'))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Category
                        </td>
                        {deals.map(deal => (
                            <td key={deal._id} className="px-4 py-3">
                                {getFitScoreCategory(deal.fitScore?.adjustedFitScore || 0)}
                            </td>
                        ))}
                    </tr>

                    {/* Deal Info */}
                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Deal Type
                        </td>
                        {deals.map(deal => renderCell(deal.dealType))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Deal Value
                        </td>
                        {deals.map(deal => renderCell(deal.dealValue, 'currency'))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Current Stage
                        </td>
                        {deals.map(deal => renderCell(deal.currentStage))}
                    </tr>

                    {/* Metric Breakdown */}
                    <tr className="bg-primary-50">
                        <td colSpan={deals.length + 1} className="px-4 py-2 font-semibold text-gray-900">
                            Metric Breakdown
                        </td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Industry Match
                        </td>
                        {deals.map(deal => renderCell(
                            (deal.fitScore?.metricBreakdown?.industryMatch?.input || 0) * 100,
                            'percentage'
                        ))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Financials
                        </td>
                        {deals.map(deal => renderCell(
                            (deal.fitScore?.metricBreakdown?.financials?.input || 0) * 100,
                            'percentage'
                        ))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Cultural Fit
                        </td>
                        {deals.map(deal => renderCell(
                            (deal.fitScore?.metricBreakdown?.cultural?.input || 0) * 100,
                            'percentage'
                        ))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Technology
                        </td>
                        {deals.map(deal => renderCell(
                            (deal.fitScore?.metricBreakdown?.technology?.input || 0) * 100,
                            'percentage'
                        ))}
                    </tr>

                    {/* Financial Data */}
                    <tr className="bg-primary-50">
                        <td colSpan={deals.length + 1} className="px-4 py-2 font-semibold text-gray-900">
                            Financial Data
                        </td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Revenue
                        </td>
                        {deals.map(deal => renderCell(deal.financials?.target?.revenue, 'currency'))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            EBITDA
                        </td>
                        {deals.map(deal => renderCell(deal.financials?.target?.ebitda, 'currency'))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Growth Rate
                        </td>
                        {deals.map(deal => renderCell(deal.financials?.target?.growthRate, 'percentage'))}
                    </tr>

                    {/* Industry Data */}
                    <tr className="bg-primary-50">
                        <td colSpan={deals.length + 1} className="px-4 py-2 font-semibold text-gray-900">
                            Industry Data
                        </td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Target Industry
                        </td>
                        {deals.map(deal => renderCell(deal.industryMatch?.targetIndustry))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Market Share
                        </td>
                        {deals.map(deal => renderCell(deal.industryMatch?.targetMarketShare, 'percentage'))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Strategic Motive
                        </td>
                        {deals.map(deal => renderCell(deal.industryMatch?.strategicMotive))}
                    </tr>

                    {/* Cultural Data */}
                    <tr className="bg-primary-50">
                        <td colSpan={deals.length + 1} className="px-4 py-2 font-semibold text-gray-900">
                            Cultural & Operational
                        </td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Org Structure
                        </td>
                        {deals.map(deal => renderCell(deal.cultural?.organizationalStructure))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Management Style
                        </td>
                        {deals.map(deal => renderCell(deal.cultural?.managementStyle))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Employee Count
                        </td>
                        {deals.map(deal => renderCell(deal.cultural?.employeeCount))}
                    </tr>

                    {/* Technology Data */}
                    <tr className="bg-primary-50">
                        <td colSpan={deals.length + 1} className="px-4 py-2 font-semibold text-gray-900">
                            Technology Stack
                        </td>
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Infrastructure
                        </td>
                        {deals.map(deal => renderCell(deal.technology?.infrastructureType))}
                    </tr>

                    <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                            Dev Methodology
                        </td>
                        {deals.map(deal => renderCell(deal.technology?.developmentMethodology))}
                    </tr>

                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-700 sticky left-0 bg-white z-10">
                            Legacy Systems
                        </td>
                        {deals.map(deal => renderCell(deal.technology?.legacySystems ? 'Yes' : 'No'))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
