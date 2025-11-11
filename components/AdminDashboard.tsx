
import React, { useState } from 'react';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';

type AdminTab = 'menu' | 'orders';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  return (
    <div>
      <h2 className="text-4xl font-bold text-slate-800 mb-8">Admin Dashboard</h2>
      <div className="mb-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`${
              activeTab === 'menu'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
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