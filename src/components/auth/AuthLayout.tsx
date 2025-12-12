import React from 'react';
import { PageTransition } from '../common/PageTransition';
import { Header } from '../common/Header';

interface AuthLayoutProps {
    children: React.ReactNode;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToHome: () => void;
    onLogoClick?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    onNavigateToLogin,
    onNavigateToRegister,
    onNavigateToHome,
    onLogoClick,
}) => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Blob Animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-br from-light to-white">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <Header
                userType="guest"
                onNavigateToLogin={onNavigateToLogin}
                onNavigateToRegister={onNavigateToRegister}
                onNavigateToHome={onNavigateToHome}
                onLogoClick={onLogoClick || onNavigateToHome}
            />

            <main className="flex-grow flex items-center justify-center z-10 pt-24 px-4 pb-8">
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
