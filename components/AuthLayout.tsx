import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  navButtonText: string;
  onNavButtonClick: () => void;
  onLogoClick?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, navButtonText, onNavButtonClick, onLogoClick }) => {
  return (
    <div className="min-h-screen flex flex-col">
       {/* Consistent Header Design */}
       <header className="py-4 px-6 sm:px-8 bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 flex justify-between items-center shadow-sm">
            <button 
                onClick={onLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none text-left"
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
            <div>
                <button 
                    onClick={onNavButtonClick}
                    className="font-medium text-slate-600 hover:text-orange-600 transition-colors text-sm sm:text-base px-3 py-2"
                >
                    {navButtonText}
                </button>
            </div>
       </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-100/50 p-8 space-y-6 border border-white/50">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};