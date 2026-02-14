import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import authService from '../../services/authService';
import NotificationBell from '../notifications/NotificationBell';

export default function Header() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <TrendingUp className="w-8 h-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">Smart M&A Platform</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/fit-score" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100">
                            <TrendingUp className="w-4 h-4" />
                            <span>Fit Score Generator</span>
                        </Link>
                    </nav>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Notification Bell */}
                        <NotificationBell />

                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/dashboard"
                            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/fit-score"
                            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>Fit Score Generator</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
