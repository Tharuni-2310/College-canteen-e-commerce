import React, { useState, useRef, useEffect } from 'react';
import { CartItem, User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  cartItems: CartItem[];
  onNavigate: (view: 'MENU' | 'MY_ORDERS' | 'ADMIN_DASHBOARD') => void;
  onPlaceOrder: () => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
}

const ShoppingCartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CartPopover: React.FC<{
  cartItems: CartItem[];
  onPlaceOrder: () => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
  onClose: () => void;
}> = ({ cartItems, onPlaceOrder, onUpdateCart, onClose }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={popoverRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Cart</h3>
      </div>
      <div className="overflow-y-auto max-h-64 divide-y divide-gray-200">
        {cartItems.length === 0 ? (
          <p className="p-4 text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-2">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover"/>
                <div>
                    <p className="font-semibold text-sm text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onUpdateCart(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-800">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateCart(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-800">+</button>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center font-bold text-gray-800">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <button onClick={onPlaceOrder} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, cartItems, onNavigate, onPlaceOrder, onUpdateCart }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderNavLinks = () => {
    if (!currentUser) {
      return null;
    }

    if (currentUser.role === UserRole.ADMIN) {
      return (
        <button onClick={() => onNavigate('ADMIN_DASHBOARD')} className="text-gray-600 hover:text-indigo-600">Admin Dashboard</button>
      );
    }

    // Student Links
    return (
      <>
        <button onClick={() => onNavigate('MENU')} className="text-gray-600 hover:text-indigo-600">Menu</button>
        <button onClick={() => onNavigate('MY_ORDERS')} className="text-gray-600 hover:text-indigo-600">My Orders</button>
        <div className="relative">
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-gray-600 hover:text-indigo-600">
            <ShoppingCartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
            )}
          </button>
          {isCartOpen && <CartPopover cartItems={cartItems} onPlaceOrder={onPlaceOrder} onUpdateCart={onUpdateCart} onClose={() => setIsCartOpen(false)} />}
        </div>
      </>
    );
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => onNavigate(currentUser?.role === UserRole.ADMIN ? 'ADMIN_DASHBOARD' : 'MENU')}>
          College Canteen
        </h1>
        <nav className="flex items-center space-x-4 md:space-x-6">
          {renderNavLinks()}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">{currentUser.email}</span>
              <button onClick={onLogout} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;