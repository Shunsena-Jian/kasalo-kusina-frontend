import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { EyeIcon, EyeOffIcon } from './Icons';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onGuestLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin, onGuestLogin, onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // In a real app, you would handle registration logic here.
    // For now, we automatically log the user in on "success".
    setError('');
    onRegisterSuccess();
  };

  return (
    <AuthLayout
      navButtonText="Sign In"
      onNavButtonClick={onNavigateToLogin}
    >
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Create Account
        </h1>
        <p className="text-slate-600 mt-2">Join Kasalo Kusina today</p>
      </div>
      
      <form onSubmit={handleRegisterAttempt} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="choose_a_username"
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 pr-10 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="create_a_password"
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

        <div className="relative">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-3 pr-10 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="re-enter_password"
          />
          {confirmPassword && (
            <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                  aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
              >
                  {isConfirmPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
          )}
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-lg text-white font-bold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
          >
            Register
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