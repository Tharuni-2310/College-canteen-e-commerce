
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left Panel: Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
          alt="Delicious food spread"
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-end p-12">
            <div className="text-white">
                <h1 className="text-5xl font-extrabold tracking-tight">The Hungry Hub</h1>
                <p className="mt-2 text-lg text-blue-100">Your campus food destination.</p>
            </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">Welcome Back!</h2>
            <p className="mt-2 text-slate-600">Log in to order from the canteen.</p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@college.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 text-sm text-slate-600 space-y-2 bg-stone-50 p-4 rounded-lg border border-stone-200">
                <p className="font-semibold text-slate-800">Demo Credentials:</p>
                <p>Student Email: <span className="font-mono bg-stone-200 text-slate-800 px-2 py-1 rounded">student@college.com</span></p>
                <p>Student Password: <span className="font-mono bg-stone-200 text-slate-800 px-2 py-1 rounded">password123</span></p>
                <p className="pt-2">Admin Email: <span className="font-mono bg-stone-200 text-slate-800 px-2 py-1 rounded">admin@college.com</span></p>
                <p>Admin Password: <span className="font-mono bg-stone-200 text-slate-800 px-2 py-1 rounded">adminpassword</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;