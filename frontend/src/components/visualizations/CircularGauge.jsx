import { getFitScoreColor, getFitScoreCategory } from '../../utils/constants';

export default function CircularGauge({ score, size = 200 }) {
    const normalizedScore = Math.min(100, Math.max(0, score || 0));
    const circumference = 2 * Math.PI * 70; // radius = 70
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
    const color = getFitScoreColor(normalizedScore);
    const category = getFitScoreCategory(normalizedScore);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    className="transform -rotate-90"
                    width={size}
                    height={size}
                    viewBox="0 0 160 160"
                >
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold" style={{ color }}>
                        {Math.round(normalizedScore)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">out of 100</div>
                </div>
            </div>

            {/* Category label */}
            <div
                className="mt-4 px-4 py-2 rounded-full font-semibold text-sm"
                style={{
                    backgroundColor: `${color}20`,
                    color: color
                }}
            >
                {category}
            </div>
        </div>
    );
}
