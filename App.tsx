
import React, { useState, useCallback } from 'react';
import { User, UserRole, CartItem, MenuItem } from './types';
import { mockApi } from './services/mockApi';
import Header from './components/Header';
import Menu from './components/Menu';
import StudentOrders from './components/StudentOrders';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

type View = 'MENU' | 'MY_ORDERS' | 'ADMIN_DASHBOARD';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<View>('MENU');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await mockApi.login(email, password);
      if (user) {
        setCurrentUser(user);
        if (user.role === UserRole.ADMIN) {
          setView('ADMIN_DASHBOARD');
        } else {
          setView('MENU');
        }
      } else {
        alert('Invalid email or password. Please use a demo account.');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  const handleUpdateCart = useCallback((itemId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.id !== itemId);
      }
      return prevCart.map(item => item.id === itemId ? { ...item, quantity } : item);
    });
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!currentUser || cart.length === 0) return;
    if (currentUser.role === UserRole.ADMIN) {
        alert("Admins cannot place orders.");
        return;
    }
    setIsLoading(true);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      await mockApi.placeOrder({ userId: currentUser.id, userEmail: currentUser.email, items: cart, total });
      alert('Order placed successfully!');
      setCart([]);
      setView('MY_ORDERS');
    } catch (error) {
      alert('Failed to place order.');
    } finally {
      setIsLoading(false);
    }
  }, [cart, currentUser]);

  const renderContent = () => {
    if (!currentUser) {
        return null;
    }

    if (currentUser.role === UserRole.ADMIN) {
        return <AdminDashboard />;
    }

    // Student View
    switch (view) {
      case 'MENU':
        return <Menu onAddToCart={handleAddToCart} />;
      case 'MY_ORDERS':
        return <StudentOrders userId={currentUser.id} />;
      default:
        return <Menu onAddToCart={handleAddToCart} />;
    }
  };
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        cartItems={cart}
        onNavigate={setView}
        onPlaceOrder={handlePlaceOrder}
        onUpdateCart={handleUpdateCart}
        currentView={view}
      />
      <main className="flex-grow container mx-auto p-6 md:p-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;