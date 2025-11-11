import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../types';
import { mockApi } from '../services/mockApi';

const AdminItemForm: React.FC<{ 
    itemToEdit: MenuItem | null; 
    onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
    onCancel: () => void;
}> = ({ itemToEdit, onSave, onCancel }) => {
    const [item, setItem] = useState<Omit<MenuItem, 'id'> | MenuItem>(
        itemToEdit || { name: '', price: 0, category: '', imageUrl: '', available: true }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setItem(prev => ({ ...prev, [name]: checked }));
        } else {
            setItem(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6">{itemToEdit ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={item.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
                    <input name="price" type="number" value={item.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required step="0.01" />
                    <input name="category" value={item.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" required />
                    <input name="imageUrl" value={item.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" required />
                    <div className="flex items-center">
                        <input id="available" name="available" type="checkbox" checked={item.available} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">Available</label>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminMenu: React.FC = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const fetchMenu = useCallback(async () => {
        setIsLoading(true);
        const items = await mockApi.getMenuItems();
        setMenuItems(items);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const handleSave = async (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
        if ('id' in itemData) {
            await mockApi.updateMenuItem(itemData);
        } else {
            await mockApi.addMenuItem(itemData);
        }
        setIsFormOpen(false);
        setEditingItem(null);
        fetchMenu();
    };

    const handleDelete = async (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await mockApi.deleteMenuItem(itemId);
            fetchMenu();
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700">Menu Items</h3>
                <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add New Item</button>
            </div>
            {isFormOpen && <AdminItemForm itemToEdit={editingItem} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
                        ) : menuItems.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt={item.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMenu;
