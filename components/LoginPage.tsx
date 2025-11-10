import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { EyeIcon, EyeOffIcon } from './Icons';


interface LoginPageProps {
  onRegisteredLogin: () => void;
  onGuestLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisteredLogin, onGuestLogin, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password.');
      return;
    }
    // Simple validation for demonstration purposes
    setError('');
    onRegisteredLogin();
  };

  return (
    <AuthLayout
      navButtonText="Register"
      onNavButtonClick={onNavigateToRegister}
    >
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Kasalo Kusina
            </h1>
            <p className="text-slate-600 mt-2">Sign in to discover recipes</p>
        </div>
        
        <form onSubmit={handleLoginAttempt} className="space-y-6">
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Username
            </label>
            <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="your_username"
            />
        </div>

        <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
            </label>
            <input
            id="password"
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 pr-10 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="your_password"
            />
            {password && (
              <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                  {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            )}
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
            <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-bold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
            >
            Sign In
            </button>
        </div>
        </form>

        <div className="text-center">
            <button
                onClick={onGuestLogin}
                type="button"
                className="text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
            >
                Or continue as a guest
            </button>
        </div>
    </AuthLayout>
  );
};