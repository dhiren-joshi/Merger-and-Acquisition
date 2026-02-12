import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function WeightDistributionChart({ weights }) {
    if (!weights) return null;

    const data = [
        { name: 'Industry Match', value: weights.industryMatch * 100 },
        { name: 'Financials', value: weights.financials * 100 },
        { name: 'Cultural Fit', value: weights.cultural * 100 },
        { name: 'Technology', value: weights.technology * 100 },
    ];

    const renderLabel = (entry) => {
        return `${entry.value.toFixed(0)}%`;
    };

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
