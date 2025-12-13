import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToHome?: () => void;
    onNavigateToAnalyze?: () => void;
    onNavigateToCreateRecipe?: () => void;
    onNavigateToProfile?: () => void;
    onNavigateToLogin?: () => void;
    onNavigateToRegister?: () => void;
    onLogout?: () => void;
    userType?: 'guest' | 'registered' | null;
}

const sidebarVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: {
        opacity: 1,
        backdropFilter: "blur(4px)",
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: { duration: 0.3 }
    }
};

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    onNavigateToHome,
    onNavigateToAnalyze,
    onNavigateToCreateRecipe,
    onNavigateToProfile,
    onNavigateToLogin,
    onNavigateToRegister,
    onLogout,
    userType = 'registered'
}) => {

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-[60]"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Sidebar Dropdown */}
                    <motion.div
                        className="fixed top-20 right-4 w-80 glass rounded-3xl shadow-2xl z-[70] p-6 flex flex-col border border-white/40"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Menu</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-grow space-y-2">
                            <button
                                onClick={() => { onNavigateToHome?.(); onClose(); }}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3 backdrop-blur-sm"
                            >
                                <span>🏠</span> Home
                            </button>

                            {userType === 'registered' && (
                                <>
                                    <button
                                        onClick={() => { onNavigateToCreateRecipe?.(); onClose(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3 backdrop-blur-sm"
                                    >
                                        <span>🍳</span> Create Recipe
                                    </button>
                                    <button
                                        onClick={() => { onNavigateToAnalyze?.(); onClose(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3 backdrop-blur-sm"
                                    >
                                        <span>✨</span> AI Chef
                                    </button>
                                    <hr className="border-white/30 dark:border-slate-700/50 my-2" />
                                    <button
                                        onClick={() => { onNavigateToProfile?.(); onClose(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3 backdrop-blur-sm"
                                    >
                                        <span>👤</span> Profile
                                    </button>
                                </>
                            )}

                            <div className="mt-2 pt-2 border-t border-white/30 dark:border-slate-700/50">
                                <p className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Settings</p>
                                <div className="px-4 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-200">
                                        <span>🌙</span> Dark Mode
                                    </div>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </nav>

                        <div className="mt-6 pt-4 border-t border-white/30 dark:border-slate-700/50">
                            {userType === 'registered' ? (
                                <button
                                    onClick={() => { onLogout?.(); onClose(); }}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-3 backdrop-blur-sm"
                                >
                                    <span>🚪</span> Logout
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { onNavigateToLogin?.(); onClose(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-3 backdrop-blur-sm"
                                    >
                                        <span>🔑</span> Sign In
                                    </button>
                                    <button
                                        onClick={() => { onNavigateToRegister?.(); onClose(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors flex items-center gap-3 backdrop-blur-sm"
                                    >
                                        <span>✨</span> Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
