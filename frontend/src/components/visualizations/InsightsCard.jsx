import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export default function InsightsCard({ strengths = [], risks = [], recommendations = [] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strengths */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                </div>

                {strengths.length > 0 ? (
                    <ul className="space-y-3">
                        {strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-600 mt-1">✓</span>
                                <span className="text-sm text-gray-700">{strength}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No significant strengths identified</p>
                )}
            </div>

            {/* Risks */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Risks</h3>
                </div>

                {risks.length > 0 ? (
                    <ul className="space-y-3">
                        {risks.map((risk, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-600 mt-1">✗</span>
                                <span className="text-sm text-gray-700">{risk}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No significant risks identified</p>
                )}
            </div>

            {/* Recommendations */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                </div>

                {recommendations.length > 0 ? (
                    <ul className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="text-primary-600 font-bold mt-1">{index + 1}.</span>
                                <span className="text-sm text-gray-700">{rec}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No specific recommendations</p>
                )}
            </div>
        </div>
    );
}
