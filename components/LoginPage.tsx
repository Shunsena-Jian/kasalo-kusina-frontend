import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
    </svg>
);


interface LoginPageProps {
  onRegisteredLogin: () => void;
  onGuestLogin: () => void;
  onNavigateToRegister: () => void;
  onLogoClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisteredLogin, onGuestLogin, onNavigateToRegister, onLogoClick }) => {
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
      navButtonText="Create Account"
      onNavButtonClick={onNavigateToRegister}
      onLogoClick={onLogoClick}
    >
        <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-800">
            Welcome Back
            </h1>
            <p className="text-slate-500 mt-2">Sign in to discover your next meal</p>
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
            className="mt-1 block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
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
            className="mt-1 block w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            placeholder="your_password"
            />
            {password && (
              <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              >
                  {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            )}
        </div>
        
        {error && <p className="text-sm text-red-600 text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

        <div>
            <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-white font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-0.5"
            >
            Sign In
            </button>
        </div>
        </form>

        <div className="text-center pt-2">
            <button
                onClick={onGuestLogin}
                type="button"
                className="text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors"
            >
                Or continue as a guest
            </button>
        </div>
    </AuthLayout>
  );
};