import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalystDashboard from './pages/AnalystDashboard';
import FitScoreGenerator from './pages/FitScoreGenerator';
import Analytics from './pages/Analytics';
import DealDetails from './pages/DealDetails';
import DealComparison from './pages/DealComparison';
import PrivateRoute from './components/common/PrivateRoute';
import './styles/globals.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/analyst-dashboard"
                        element={
                            <PrivateRoute>
                                <AnalystDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/fit-score"
                        element={
                            <PrivateRoute>
                                <FitScoreGenerator />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <PrivateRoute>
                                <Analytics />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/comparison"
                        element={
                            <PrivateRoute>
                                <DealComparison />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/deals/:dealId"
                        element={
                            <PrivateRoute>
                                <DealDetails />
                            </PrivateRoute>
                        }
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>

                {/* Toast Notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </BrowserRouter>
    );
}

export default App;
