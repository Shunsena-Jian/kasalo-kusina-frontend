import React from 'react';
import { PageTransition } from '../common/PageTransition';

interface AuthLayoutProps {
    children: React.ReactNode;
    navButtonText: string;
    onNavButtonClick: () => void;
    onLogoClick?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    navButtonText,
    onNavButtonClick,
    onLogoClick,
}) => {
    return (
        <div className="min-h-screen flex flex-col p-4 relative overflow-hidden">
            {/* Background Blob Animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-br from-light to-white">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <header className="flex justify-between items-center py-4 px-4 sm:px-8 w-full max-w-5xl mx-auto z-10">
                <div
                    onClick={onLogoClick}
                    className="font-extrabold text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform cursor-pointer"
                >
                    Kasalo Kusina
                </div>
                <div>
                    <button
                        onClick={onNavButtonClick}
                        className="font-bold text-dark hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-white/50"
                    >
                        {navButtonText}
                    </button>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center z-10">
                <PageTransition>
                    <div className="w-full max-w-lg">
                        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border border-white/40 relative">
                            {children}
                        </div>
                    </div>
                </PageTransition>
            </main>
        </div>
    );
};
