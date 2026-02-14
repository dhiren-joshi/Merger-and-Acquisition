import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import authService from '../services/authService';

export default function Dashboard() {
  const navigate = useNavigate();
  const isManager = authService.isManager();
  const isAnalyst = authService.isAnalyst();
  const currentUser = authService.getCurrentUser();

  const handleCreateDealClick = () => {
    navigate('/fit-score');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {isManager && 'Manager Dashboard - Deal Pipeline'}
              {isAnalyst && `My Assigned Deals`}
              {!isManager && !isAnalyst && 'Deal Pipeline'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isManager && 'Manage and assign M&A deals across different stages'}
              {isAnalyst && 'Track your assigned deals and update progress'}
              {!isManager && !isAnalyst && 'Manage your M&A deals across different stages'}
            </p>
          </div>

          <KanbanBoard onCreateDealClick={handleCreateDealClick} />
        </main>
      </div>
    </div>
  );
}

