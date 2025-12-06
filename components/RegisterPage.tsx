import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { ApiError } from '../services/api';

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

interface RegisterPageProps {
    onNavigateToLogin: () => void;
    onGuestLogin: () => void;
    onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
    onNavigateToLogin,
    onGuestLogin,
    onRegisterSuccess,
}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const handleRegisterAttempt = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            await import('../services/authService').then(m => m.authService.register(username, email, password));
            onRegisterSuccess();
        } catch (err: any) {
            console.error(err);
            let hasFieldErrors = false;
            if (err instanceof ApiError && err.data?.errors && Array.isArray(err.data.errors)) {
                const newFieldErrors: { [key: string]: string } = {};
                err.data.errors.forEach((e: any) => {
                    const field = e.path === 'confirm_password' ? 'confirmPassword' : e.path;
                    if (field) {
                        newFieldErrors[field] = e.msg;
                        hasFieldErrors = true;
                    }
                });
                setFieldErrors(newFieldErrors);
            }
            if (!hasFieldErrors) {
                setError(err.message || 'Registration failed');
            }
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
        <AuthLayout navButtonText="Sign In" onNavButtonClick={onNavigateToLogin} onLogoClick={onNavigateToLogin}>
            <div className="text-center mb-6">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                >
                    Create Account
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 mt-2 font-medium"
                >
                    Join Kasalo Kusina today
                </motion.p>
            </div>

            <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleRegisterAttempt}
                className="space-y-5"
            >
                <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block text-sm font-bold text-dark mb-1 ml-1">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 focus:border-primary/50 text-dark rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium placeholder-slate-400"
                        placeholder="Username"
                    />
                    {fieldErrors.username && (
                        <p className="mt-1 ml-1 text-sm text-primary font-semibold">{fieldErrors.username}</p>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-bold text-dark mb-1 ml-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 focus:border-primary/50 text-dark rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium placeholder-slate-400"
                        placeholder="email@sample.com"
                    />
                    {fieldErrors.email && (
                        <p className="mt-1 ml-1 text-sm text-primary font-semibold">{fieldErrors.email}</p>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                    <label htmlFor="password" className="block text-sm font-bold text-dark mb-1 ml-1">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-5 py-3 pr-10 bg-slate-50 border-2 border-slate-200 focus:border-primary/50 text-dark rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium placeholder-slate-400"
                        placeholder="Password"
                    />
                    {password && (
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-slate-500 hover:text-primary transition-colors"
                            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        >
                            {isPasswordVisible ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {fieldErrors.password && (
                        <p className="mt-1 ml-1 text-sm text-primary font-semibold">{fieldErrors.password}</p>
                    )}
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                    <label
                        htmlFor="confirm_password"
                        className="block text-sm font-bold text-dark mb-1 ml-1"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirm_password"
                        name="confirm_password"
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-5 py-3 pr-10 bg-slate-50 border-2 border-slate-200 focus:border-primary/50 text-dark rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium placeholder-slate-400"
                        placeholder="Confirm Password"
                    />
                    {confirmPassword && (
                        <button
                            type="button"
                            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-slate-500 hover:text-primary transition-colors"
                            aria-label={
                                isConfirmPasswordVisible ? 'Hide password' : 'Show password'
                            }
                        >
                            {isConfirmPasswordVisible ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {fieldErrors.confirmPassword && (
                        <p className="mt-1 ml-1 text-sm text-primary font-semibold">{fieldErrors.confirmPassword}</p>
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
                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 mt-2 border border-transparent rounded-xl shadow-lg text-white font-bold text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Register
                    </button>
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
