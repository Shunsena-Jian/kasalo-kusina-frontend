import React, { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', fullWidth = false, children, ...props }, ref) => {
        const baseStyles = "px-6 py-2 rounded-full font-bold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90",
            secondary: "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200",
            danger: "bg-red-500 text-white hover:bg-red-600",
            ghost: "bg-transparent text-slate-600 hover:bg-slate-100 shadow-none"
        };

        const widthStyles = fullWidth ? "w-full flex justify-center" : "";

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
