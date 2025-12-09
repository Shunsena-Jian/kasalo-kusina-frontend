import React from 'react';

interface HeaderProps {
    userType: 'guest' | 'registered' | null;
    onLogout: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToHome?: () => void;
    onNavigateToAnalyze?: () => void;
    onLogoClick?: () => void;
    currentView?: 'home' | 'analyze';
}

export const Header: React.FC<HeaderProps> = ({
    userType,
    onLogout,
    onNavigateToLogin,
    onNavigateToRegister,
    onNavigateToHome,
    onNavigateToAnalyze,
    onLogoClick,
    currentView,
}) => {
    return (
        <header className="py-4 px-4 sm:px-8 border-none sticky top-0 z-20 flex justify-between items-center bg-opacity-60 bg-white/30 backdrop-blur-md">
            <div
                onClick={onLogoClick}
                className="text-left font-extrabold text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform cursor-pointer"
            >
                Kasalo Kusina
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {userType === 'registered' && (
                    <>
                        <button
                            onClick={onNavigateToHome}
                            className={`font-bold transition-colors px-4 py-2 rounded-full hover:bg-white/50 text-sm sm:text-base ${currentView === 'home' ? 'text-primary bg-white/50' : 'text-slate-600 hover:text-primary'
                                }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={onNavigateToAnalyze}
                            className={`font-bold transition-colors px-4 py-2 rounded-full hover:bg-white/50 text-sm sm:text-base ${currentView === 'analyze' ? 'text-primary bg-white/50' : 'text-slate-600 hover:text-primary'
                                }`}
                        >
                            Analyze Dish
                        </button>
                    </>
                )}

                {userType === 'guest' && (
                    <>
                        <button
                            onClick={onNavigateToLogin}
                            className="font-bold text-dark hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-white/50 text-sm sm:text-base"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={onNavigateToRegister}
                            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity text-sm sm:text-base"
                        >
                            Register
                        </button>
                    </>
                )}
                {userType === 'registered' && (
                    <button
                        onClick={onLogout}
                        className="font-bold text-dark hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-white/50 text-sm sm:text-base border border-transparent"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};
