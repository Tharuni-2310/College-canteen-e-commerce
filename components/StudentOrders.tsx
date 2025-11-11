import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { mockApi } from '../services/mockApi';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.PREPARING: return 'bg-blue-100 text-blue-800';
    case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <div className="flex flex-wrap justify-between items-start mb-4">
        <div>
            <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date.toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
        </span>
    </div>
    <div className="border-t border-gray-200 pt-4">
      {order.items.map(item => (
        <div key={item.id} className="flex justify-between items-center text-sm mb-2">
          <span>{item.name} x {item.quantity}</span>
          <span className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200 mt-4 pt-4 text-right">
      <span className="text-lg font-bold text-gray-800">Total: ₹{order.total.toFixed(2)}</span>
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        orders.map(order => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};

export default StudentOrders;
