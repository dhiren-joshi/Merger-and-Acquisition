import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BarChart3, GitCompare, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/fit-score', icon: TrendingUp, label: 'Fit Score Generator' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/comparison', icon: GitCompare, label: 'Compare Deals' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Toggle Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="px-2 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors ${isActive(item.path)
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            title={collapsed ? item.label : ''}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

