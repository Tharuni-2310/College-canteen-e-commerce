
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { mockApi } from '../services/mockApi';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return 'bg-amber-100 text-amber-800';
    case OrderStatus.PREPARING: return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.DELIVERED: return 'bg-teal-100 text-teal-800';
    case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
        <div>
            <h3 className="text-xl font-bold text-slate-800">Order <span className="text-blue-600">#{order.id}</span></h3>
            <p className="text-sm text-slate-500">{order.date.toLocaleString()}</p>
        </div>
        <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
        </span>
    </div>
    <div className="border-t border-slate-200 pt-4 space-y-2">
      {order.items.map(item => (
        <div key={item.id} className="flex justify-between items-center text-sm">
          <span className="text-slate-700">{item.name} <span className="text-slate-500">x {item.quantity}</span></span>
          <span className="text-slate-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-200 mt-4 pt-4 flex justify-end items-center">
      <span className="text-lg font-bold text-slate-800">Total: <span className="text-blue-600">₹{order.total.toFixed(2)}</span></span>
    </div>
  </div>
);


const StudentOrders: React.FC<{ userId: string }> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const studentOrders = await mockApi.getStudentOrders(userId);
      setOrders(studentOrders);
      setIsLoading(false);
    };
    fetchOrders();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center p-10">Loading your orders...</div>;
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-slate-800 mb-8">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-slate-600 text-lg">You haven't placed any orders yet.</p>
            <p className="text-slate-500 mt-2">Why not check out the menu?</p>
        </div>
      ) : (
        orders.map(order => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};

export default StudentOrders;