import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ComparisonRadarChart({ deals }) {
    if (!deals || deals.length === 0) return null;

    // Prepare data for radar chart
    const metrics = [
        { metric: 'Industry Match', key: 'industryMatch' },
        { metric: 'Financials', key: 'financials' },
        { metric: 'Cultural Fit', key: 'cultural' },
        { metric: 'Technology', key: 'technology' }
    ];

    const data = metrics.map(({ metric, key }) => {
        const dataPoint = { metric };

        deals.forEach((deal, index) => {
            const value = deal.fitScore?.metricBreakdown?.[key]?.input || 0;
            dataPoint[deal.targetCompanyName] = value * 100; // Convert to percentage
        });

        return dataPoint;
    });

    return (
        <div className="w-full" style={{ height: 500 }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />

                    {deals.map((deal, index) => (
                        <Radar
                            key={deal._id}
                            name={deal.targetCompanyName}
                            dataKey={deal.targetCompanyName}
                            stroke={COLORS[index % COLORS.length]}
                            fill={COLORS[index % COLORS.length]}
                            fillOpacity={0.3}
                        />
                    ))}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
