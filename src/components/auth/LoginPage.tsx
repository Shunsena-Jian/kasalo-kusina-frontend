import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { authService } from '@/services/authService.ts';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={className || 'w-6 h-6'}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={className || 'w-6 h-6'}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243"
        />
    </svg>
);

interface LoginPageProps {
    onRegisteredLogin: () => void;
    onGuestLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToLogin: () => void;
    onNavigateToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
    onRegisteredLogin,
    onGuestLogin,
    onNavigateToRegister,
    onNavigateToLogin,
    onNavigateToHome,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginAttempt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            setError('Please enter both email and password.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await authService.login(email, password);
            onRegisteredLogin();
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <AuthLayout
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToRegister={onNavigateToRegister}
            onNavigateToHome={onNavigateToHome}
            onLogoClick={onNavigateToHome}
        >
            <div className="text-center mb-6">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                >
                    Kasalo Kusina
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 dark:text-slate-400 mt-2 font-medium"
                >
                    Sign in to discover recipes
                </motion.p>
            </div>

            <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleLoginAttempt}
                className="space-y-6"
            >
                <motion.div variants={itemVariants}>
                    <Input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        required
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your_email"
                        className="px-5 py-3"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="your_password"
                        className="px-5 py-3 pr-10"
                    />
                    {password && (
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute right-0 top-9 pr-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
                            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        >
                            {isPasswordVisible ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-primary font-bold text-center bg-primary/10 py-2 rounded-lg"
                    >
                        {error}
                    </motion.p>
                )}

                <motion.div variants={itemVariants}>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                        className={`py-4 text-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </motion.div>
            </motion.form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6"
            >
                <button
                    onClick={onGuestLogin}
                    type="button"
                    className="text-sm font-bold text-secondary hover:text-primary transition-colors underline decoration-2 decoration-transparent hover:decoration-current underline-offset-4"
                >
                    Or continue as a guest
                </button>
            </motion.div>
        </AuthLayout>
    );
};
