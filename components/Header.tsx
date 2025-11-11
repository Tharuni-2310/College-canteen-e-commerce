
import React, { useState, useRef, useEffect } from 'react';
import { CartItem, User, UserRole } from '../types';

type View = 'MENU' | 'MY_ORDERS' | 'ADMIN_DASHBOARD';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  cartItems: CartItem[];
  currentView: View;
  onNavigate: (view: View) => void;
  onPlaceOrder: () => void;
  onUpdateCart: (itemId: string, quantity: number) => void;
}

const ShoppingCartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
    <div ref={popoverRef} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-20 border border-slate-200">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Your Cart</h3>
      </div>
      <div className="overflow-y-auto max-h-64 divide-y divide-slate-100">
        {cartItems.length === 0 ? (
          <p className="p-4 text-slate-500">Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover"/>
                <div>
                    <p className="font-semibold text-sm text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-500">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onUpdateCart(item.id, item.quantity - 1)} className="text-slate-500 hover:text-slate-800 font-bold">-</button>
                <span className="font-medium">{item.quantity}</span>
                <button onClick={() => onUpdateCart(item.id, item.quantity + 1)} className="text-slate-500 hover:text-slate-800 font-bold">+</button>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-b-lg">
          <div className="flex justify-between items-center font-bold text-slate-800 mb-4">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <button onClick={onPlaceOrder} className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, cartItems, onNavigate, onPlaceOrder, onUpdateCart, currentView }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderNavLinks = () => {
    if (!currentUser) return null;

    const navLinkClasses = (view: View) => 
        `px-4 py-2 rounded-md font-medium transition-colors ${
            currentView === view 
            ? 'bg-teal-100 text-teal-700' 
            : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
        }`;

    if (currentUser.role === UserRole.ADMIN) {
      return (
        <button onClick={() => onNavigate('ADMIN_DASHBOARD')} className={navLinkClasses('ADMIN_DASHBOARD')}>
            Dashboard
        </button>
      );
    }

    return (
      <>
        <button onClick={() => onNavigate('MENU')} className={navLinkClasses('MENU')}>
            Menu
        </button>
        <button onClick={() => onNavigate('MY_ORDERS')} className={navLinkClasses('MY_ORDERS')}>
            My Orders
        </button>
      </>
    );
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-teal-600 cursor-pointer" onClick={() => onNavigate(currentUser?.role === UserRole.ADMIN ? 'ADMIN_DASHBOARD' : 'MENU')}>
                The Hungry Hub
            </h1>
            
            <nav className="hidden md:flex items-center space-x-4">
                {renderNavLinks()}
            </nav>
            
            <div className="flex items-center space-x-6">
                {currentUser?.role === UserRole.STUDENT && (
                    <div className="relative">
                        <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-slate-600 hover:text-teal-600">
                            <ShoppingCartIcon />
                            {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartItemCount}</span>
                            )}
                        </button>
                        {isCartOpen && <CartPopover cartItems={cartItems} onPlaceOrder={onPlaceOrder} onUpdateCart={onUpdateCart} onClose={() => setIsCartOpen(false)} />}
                    </div>
                )}
                {currentUser && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600 hidden sm:block">{currentUser.email}</span>
                        <button onClick={onLogout} className="text-sm font-medium text-teal-600 hover:text-teal-800 border border-teal-500 px-3 py-1.5 rounded-md hover:bg-teal-50 transition-colors">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

export default Header;
