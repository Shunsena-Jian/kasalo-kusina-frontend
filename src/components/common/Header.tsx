import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';
import { Sidebar } from './Sidebar';

interface HeaderProps {
    userType: 'guest' | 'registered' | null;
    onLogout?: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToHome?: () => void;
    onNavigateToAnalyze?: () => void;
    onNavigateToCreateRecipe?: () => void;
    onNavigateToProfile?: () => void;
    onLogoClick?: () => void;
    onSearch?: (query: string) => void;
    currentView?: 'home' | 'analyze' | 'create-recipe' | 'profile' | 'search';
}

export const Header: React.FC<HeaderProps> = ({
    userType,
    onLogout,
    onNavigateToLogin,
    onNavigateToRegister,
    onNavigateToHome,
    onNavigateToAnalyze,
    onNavigateToCreateRecipe,
    onNavigateToProfile,
    onLogoClick,
    onSearch,
    currentView,
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsRecipesOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinkClass = (isActive: boolean) =>
        `font-bold px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive
            ? 'text-primary bg-primary/10'
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
        }`;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() && onSearch) {
            onSearch(searchQuery);
            setIsRecipesOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <>
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
                            <nav className="hidden md:flex items-center bg-white/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/40 shadow-sm">
                                <button
                                    onClick={onNavigateToHome}
                                    className={navLinkClass(currentView === 'home')}
                                >
                                    Home
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1"></div>

                                {/* Recipes Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsRecipesOpen(!isRecipesOpen)}
                                        className={navLinkClass(currentView === 'create-recipe' || isRecipesOpen)}
                                    >
                                        Recipes ▾
                                    </button>
                                    <AnimatePresence>
                                        {isRecipesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 overflow-hidden"
                                            >
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => {
                                                            onNavigateToCreateRecipe?.();
                                                            setIsRecipesOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-primary font-semibold flex items-center gap-2 transition-colors"
                                                    >
                                                        <span className="text-lg">🍳</span> Create Recipe
                                                    </button>
                                                    <hr className="border-slate-100" />
                                                    <form onSubmit={handleSearch} className="pt-2">
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Search Recipes</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Adobo..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="bg-primary text-white p-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                                                            >
                                                                🔍
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                <button
                                    onClick={onNavigateToAnalyze}
                                    className={navLinkClass(currentView === 'analyze')}
                                >
                                    Analyze Dish
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
                                <>
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigateToHome={onNavigateToHome}
                onNavigateToAnalyze={onNavigateToAnalyze}
                onNavigateToCreateRecipe={onNavigateToCreateRecipe}
                onNavigateToProfile={onNavigateToProfile}
                onLogout={onLogout}
            />
        </>
    );
};
