import React from 'react';
import DashboardCards from '../../components/DashboardCards/DashboardCards';
import DashboardCharts from '../../components/Charts/DashboardCharts';
import StudyTimer from '../../components/StudyTimer/StudyTimer';
import HeatMap from '../../components/HeatMap/HeatMap';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-light-textMuted dark:text-dark-textMuted mt-1">
            Here's what's happening with your study goals today.
          </p>
        </div>
      </div>

      <DashboardCards />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <DashboardCharts />
        </div>
        <div className="xl:col-span-1">
          <StudyTimer />
        </div>
      </div>

      <HeatMap />
    </div>
  );
};

export default Dashboard;
