
import React, { useState } from 'react';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';

type AdminTab = 'menu' | 'orders';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`${
              activeTab === 'menu'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Menu
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};

export default AdminDashboard;
