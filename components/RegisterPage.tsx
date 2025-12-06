import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { ApiError } from '../services/api';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
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
        strokeWidth={1.5}
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

    return (
        <AuthLayout navButtonText="Sign In" onNavButtonClick={onNavigateToLogin}>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Create Account
                </h1>
                <p className="text-slate-600 mt-2">Join Kasalo Kusina today</p>
            </div>

            <form onSubmit={handleRegisterAttempt} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Username"
                    />
                    {fieldErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="email@sample.com"
                    />
                    {fieldErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                </div>

                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type={isPasswordVisible ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-4 py-3 pr-10 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Password"
                    />
                    {password && (
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 hover:text-slate-700"
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
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                </div>

                <div className="relative">
                    <label
                        htmlFor="confirm_password"
                        className="block text-sm font-medium text-slate-700"
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
                        className="mt-1 block w-full px-4 py-3 pr-10 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Confirm Password"
                    />
                    {confirmPassword && (
                        <button
                            type="button"
                            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 hover:text-slate-700"
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
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-lg text-white font-bold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
                    >
                        Register
                    </button>
                </div>
            </form>

            <div className="text-center">
                <button
                    onClick={onGuestLogin}
                    type="button"
                    className="text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
                >
                    Or continue as a guest
                </button>
            </div>
        </AuthLayout>
    );
};
