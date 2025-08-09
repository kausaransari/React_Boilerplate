import React from 'react';
import { useAppSelector } from '../store/hooks';
import MainLayout from '../layouts/MainLayout';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome Back!
            </h3>
            <p className="text-gray-600">
              Hello, {currentUser?.name || 'User'}! Welcome to your dashboard.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Projects:</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Tasks:</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold">24</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Recent Activity
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Project "E-commerce App" updated</p>
              <p>• New task assigned to you</p>
              <p>• Team meeting scheduled</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
