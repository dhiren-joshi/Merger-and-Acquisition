/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                // Fit Score color scheme
                'fit-strong': '#10b981',     // Green - 81-100
                'fit-good': '#84cc16',       // Light Green - 61-80
                'fit-moderate': '#f59e0b',   // Yellow/Orange - 41-60
                'fit-weak': '#f97316',       // Orange/Red - 21-40
                'fit-poor': '#ef4444',       // Dark Red - 0-20

                // Primary brand colors
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
        },
    },
    plugins: [],
}
