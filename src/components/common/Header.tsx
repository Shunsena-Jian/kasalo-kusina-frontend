import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface HeaderProps {
    userType: 'guest' | 'registered' | null;
    onLogout?: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToHome?: () => void;
    onNavigateToAnalyze?: () => void;
    onNavigateToCreateRecipe?: () => void;
    onLogoClick?: () => void;
    currentView?: 'home' | 'analyze' | 'create-recipe';
}

export const Header: React.FC<HeaderProps> = ({
    userType,
    onLogout,
    onNavigateToLogin,
    onNavigateToRegister,
    onNavigateToHome,
    onNavigateToAnalyze,
    onNavigateToCreateRecipe,
    onLogoClick,
    currentView,
}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = (isActive: boolean) =>
        `font-bold px-4 py-2 rounded-full text-sm sm:text-base transition-all duration-200 ${isActive
            ? 'text-primary bg-primary/10'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20'
                : 'bg-transparent py-2'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
                <div
                    onClick={onLogoClick}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <div className="text-2xl font-extrabold tracking-tight text-slate-800 group-hover:text-primary transition-colors duration-300">
                        Kasalo<span className="text-primary group-hover:text-secondary transition-colors duration-300">Kusina</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {userType === 'registered' && (
                        <nav className="flex items-center bg-white/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/40 shadow-sm">
                            <button
                                onClick={onNavigateToHome}
                                className={navLinkClass(currentView === 'home')}
                            >
                                Home
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button
                                onClick={onNavigateToAnalyze}
                                className={navLinkClass(currentView === 'analyze')}
                            >
                                Analyze Dish
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                            <button
                                onClick={onNavigateToCreateRecipe}
                                className={navLinkClass(currentView === 'create-recipe')}
                            >
                                Create Recipe
                            </button>
                        </nav>
                    )}

                    <div className="flex items-center gap-3">
                        {userType === 'guest' && (
                            <>
                                <button
                                    onClick={onNavigateToLogin}
                                    className="font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2 text-sm sm:text-base"
                                >
                                    Sign In
                                </button>
                                <Button
                                    onClick={onNavigateToRegister}
                                    className="px-5 py-2 text-sm sm:text-base shadow-lg shadow-primary/20"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                        {userType === 'registered' && (
                            <Button
                                onClick={onLogout}
                                variant="ghost"
                                className="px-4 py-2 text-sm sm:text-base text-slate-500 hover:text-red-500"
                            >
                                Logout
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
