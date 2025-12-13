import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { ApiError } from '@/services/api.ts';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

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
    onNavigateToRegister: () => void;
    onNavigateToHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
    onNavigateToLogin,
    onGuestLogin,
    onRegisterSuccess,
    onNavigateToRegister,
    onNavigateToHome,
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            await import('../../services/authService').then(m => m.authService.register(username, email, password, firstName, lastName));
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
                    Create Account
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 dark:text-slate-400 mt-2 font-medium"
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
                <div className="flex gap-4">
                    <motion.div variants={itemVariants} className="flex-1">
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            className="px-5 py-3"
                            error={fieldErrors.first_name}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex-1">
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="px-5 py-3"
                            error={fieldErrors.last_name}
                        />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="px-5 py-3"
                        error={fieldErrors.username}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@sample.com"
                        className="px-5 py-3"
                        error={fieldErrors.email}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        required
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="px-5 py-3 pr-10"
                        error={fieldErrors.password}
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

                <motion.div variants={itemVariants} className="relative">
                    <Input
                        id="confirm_password"
                        name="confirm_password"
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        required
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="px-5 py-3 pr-10"
                        error={fieldErrors.confirmPassword}
                    />
                    {confirmPassword && (
                        <button
                            type="button"
                            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            className="absolute right-0 top-9 pr-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
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
                        fullWidth
                        className="py-4 text-lg mt-2 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Register
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
        </AuthLayout >
    );
};
