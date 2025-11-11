import { MenuItem, Order, OrderStatus, CartItem, User, UserRole } from '../types';

const idlyImage = 'https://images.pexels.com/photos/8695679/pexels-photo-8695679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const dosaImage = 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const puriImage = 'https://images.pexels.com/photos/10360057/pexels-photo-10360057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const parathaImage = 'https://images.pexels.com/photos/4518731/pexels-photo-4518731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const vegFriedRiceImage = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const chickenFriedRiceImage = 'https://images.pexels.com/photos/3926124/pexels-photo-3926124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const thaliImage = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const STUDENT_USER = { id: 'student1', email: 'student@college.com', role: UserRole.STUDENT, password: 'password123' };
const ADMIN_USER = { id: 'admin1', email: 'admin@college.com', role: UserRole.ADMIN, password: 'adminpassword' };

let menuItems: MenuItem[] = [
  { id: '1', name: 'Idly (2 pcs)', price: 30, category: 'Breakfast', imageUrl: idlyImage, available: true },
  { id: '2', name: 'Masala Dosa', price: 60, category: 'Breakfast', imageUrl: dosaImage, available: true },
  { id: '3', name: 'Puri with Sabji (2 pcs)', price: 40, category: 'Breakfast', imageUrl: puriImage, available: true },
  { id: '4', name: 'Aloo Paratha', price: 50, category: 'Breakfast', imageUrl: parathaImage, available: true },
  { id: '5', name: 'Veg Fried Rice', price: 80, category: 'Lunch', imageUrl: vegFriedRiceImage, available: true },
  { id: '6', name: 'Chicken Fried Rice', price: 120, category: 'Lunch', imageUrl: chickenFriedRiceImage, available: true },
  { id: '7', name: 'South Indian Thali (Meals)', price: 100, category: 'Lunch', imageUrl: thaliImage, available: true },
];

let orders: Order[] = [
    { id: 'ord1', userId: 'student1', userEmail: 'student@college.com', items: [{ id: '2', name: 'Masala Dosa', price: 60, category: 'Breakfast', imageUrl: dosaImage, available: true, quantity: 2 }], total: 120, status: OrderStatus.DELIVERED, date: new Date(Date.now() - 86400000) },
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

export const mockApi = {
  login: (email: string, password: string): Promise<User | undefined> => {
    let foundUser: { id: string; email: string; role: UserRole; password?: string; } | undefined;

    if (email === STUDENT_USER.email && password === STUDENT_USER.password) {
      foundUser = STUDENT_USER;
    } else if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      foundUser = ADMIN_USER;
    }
    
    if (foundUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userToReturn } = foundUser;
        return simulateDelay(userToReturn);
    }

    return simulateDelay(undefined);
  },

  getMenuItems: (): Promise<MenuItem[]> => simulateDelay([...menuItems]),
  
  addMenuItem: (itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const newItem: MenuItem = { ...itemData, id: Date.now().toString() };
    menuItems.push(newItem);
    return simulateDelay(newItem);
  },
  
  updateMenuItem: (updatedItem: MenuItem): Promise<MenuItem> => {
    menuItems = menuItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    return simulateDelay(updatedItem);
  },

  deleteMenuItem: (itemId: string): Promise<void> => {
      menuItems = menuItems.filter(item => item.id !== itemId);
      return simulateDelay(undefined);
  },

  placeOrder: (orderData: { userId: string; userEmail: string, items: CartItem[], total: number }): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `ord${Date.now()}`,
      status: OrderStatus.PENDING,
      date: new Date(),
    };
    orders.push(newOrder);
    return simulateDelay(newOrder);
  },

  getStudentOrders: (userId: string): Promise<Order[]> => {
    const studentOrders = orders.filter(o => o.userId === userId);
    return simulateDelay([...studentOrders].sort((a,b) => b.date.getTime() - a.date.getTime()));
  },

  getAllOrders: (): Promise<Order[]> => {
    return simulateDelay([...orders].sort((a,b) => b.date.getTime() - a.date.getTime()));
  },
  
  updateOrderStatus: (orderId: string, status: OrderStatus): Promise<Order> => {
    let updatedOrder: Order | undefined;
    orders = orders.map(order => {
      if (order.id === orderId) {
        updatedOrder = { ...order, status };
        return updatedOrder;
      }
      return order;
    });
    if (!updatedOrder) throw new Error('Order not found');
    return simulateDelay(updatedOrder);
  },
};