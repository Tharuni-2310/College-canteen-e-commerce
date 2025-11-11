
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, CartItem } from '../types';
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

const OrderDetails: React.FC<{ items: CartItem[] }> = ({ items }) => (
    <div className="p-4 bg-slate-50">
        <h4 className="font-semibold text-slate-700 mb-2">Order Items:</h4>
        <ul className="space-y-1">
            {items.map(item => (
                <li key={item.id} className="text-sm text-slate-600 flex justify-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
            ))}
        </ul>
    </div>
);


const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        const allOrders = await mockApi.getAllOrders();
        setOrders(allOrders);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        await mockApi.updateOrderStatus(orderId, status);
        fetchOrders();
    };

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading orders...</div>;
    }
    
    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-700 mb-6">All Orders</h3>
            {orders.length === 0 ? (
                <p className="text-slate-600">No orders have been placed yet.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {orders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr onClick={() => toggleExpand(order.id)} className="hover:bg-slate-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 text-slate-400 ${expandedOrderId === order.id ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.userEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.date.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">₹{order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={e => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                className={`p-1.5 rounded-md border text-xs font-semibold ${getStatusColor(order.status)} border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer`}
                                            >
                                                {Object.values(OrderStatus).map(status => (
                                                    <option key={status} value={status} className="bg-white text-slate-800">{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order.id && (
                                        <tr>
                                            <td colSpan={6} className="p-0">
                                                <OrderDetails items={order.items} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
