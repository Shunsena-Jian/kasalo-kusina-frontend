import React from 'react';

interface HeaderProps {
  userType: 'guest' | 'registered' | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userType, onLogout, onNavigateToLogin, onNavigateToRegister, onLogoClick }) => {
  return (
    <header className="py-4 px-6 sm:px-8 bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 flex justify-between items-center shadow-sm">
      <button 
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none text-left"
        aria-label="Go to home"
      >
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-2 rounded-lg shadow-orange-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
            </svg>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
            Kasalo Kusina
            </h1>
            <p className="text-slate-500 text-xs font-medium tracking-wide uppercase">Smart Recipe Finder</p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        {userType === 'guest' && (
          <>
            <button 
                onClick={onNavigateToLogin}
                className="font-medium text-slate-600 hover:text-orange-600 transition-colors text-sm sm:text-base px-3 py-2"
            >
                Sign In
            </button>
             <button 
                onClick={onNavigateToRegister}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-full shadow-lg shadow-slate-300 hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
                Get Started
            </button>
          </>
        )}
        {userType === 'registered' && (
          <button 
            onClick={onLogout}
            className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-50 hover:text-red-600 transition-colors text-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};