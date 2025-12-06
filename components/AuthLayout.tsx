import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    navButtonText: string;
    onNavButtonClick: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    navButtonText,
    onNavButtonClick,
}) => {
    return (
        <div className="min-h-screen flex flex-col p-4">
            <header className="flex justify-between items-center py-4 px-4 sm:px-8 w-full max-w-5xl mx-auto">
                <div className="font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    KK
                </div>
                <div>
                    <button
                        onClick={onNavButtonClick}
                        className="font-semibold text-slate-600 hover:text-sky-500 transition-colors"
                    >
                        {navButtonText}
                    </button>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-black/5">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
