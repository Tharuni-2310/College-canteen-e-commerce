
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { mockApi } from '../services/mockApi';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-teal-500 text-white font-bold py-1 px-3 rounded-full text-sm shadow-md">
            ₹{item.price.toFixed(2)}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-slate-800 truncate flex-grow">{item.name}</h3>
        <p className="text-sm text-slate-500 mb-4">{item.category}</p>
        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {item.available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};


const Menu: React.FC<{ onAddToCart: (item: MenuItem) => void }> = ({ onAddToCart }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const items = await mockApi.getMenuItems();
      setMenuItems(items);
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Loading menu...</div>;
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-slate-800 mb-8">Today's Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menuItems.map(item => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
