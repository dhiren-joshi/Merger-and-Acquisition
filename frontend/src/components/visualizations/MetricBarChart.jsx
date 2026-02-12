import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MetricBarChart({ metricBreakdown }) {
    if (!metricBreakdown) return null;

    const data = [
        {
            name: 'Industry Match',
            'Raw Score': (metricBreakdown.industryMatch?.input || 0) * 100,
            'Weighted Score': (metricBreakdown.industryMatch?.weightedScore || 0) * 100,
        },
        {
            name: 'Financials',
            'Raw Score': (metricBreakdown.financials?.input || 0) * 100,
            'Weighted Score': (metricBreakdown.financials?.weightedScore || 0) * 100,
        },
        {
            name: 'Cultural Fit',
            'Raw Score': (metricBreakdown.cultural?.input || 0) * 100,
            'Weighted Score': (metricBreakdown.cultural?.weightedScore || 0) * 100,
        },
        {
            name: 'Technology',
            'Raw Score': (metricBreakdown.technology?.input || 0) * 100,
            'Weighted Score': (metricBreakdown.technology?.weightedScore || 0) * 100,
        },
    ];

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Raw Score" fill="#93c5fd" />
                    <Bar dataKey="Weighted Score" fill="#2563eb" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
