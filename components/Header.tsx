import React from 'react';

interface HeaderProps {
  userType: 'guest' | 'registered' | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userType, onLogout, onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <header className="py-4 px-4 sm:px-8 bg-white/70 backdrop-blur-lg border-b border-black/10 sticky top-0 z-10 flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Kasalo Kusina
        </h1>
        <p className="text-slate-600 mt-1 text-sm md:text-base">Your Filipino Dish Recipe Finder</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {userType === 'guest' && (
          <>
            <button 
                onClick={onNavigateToLogin}
                className="font-semibold text-slate-600 hover:text-sky-500 transition-colors text-sm sm:text-base"
            >
                Sign In
            </button>
             <button 
                onClick={onNavigateToRegister}
                className="px-4 py-2 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors text-sm sm:text-base"
            >
                Register
            </button>
          </>
        )}
        {userType === 'registered' && (
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};