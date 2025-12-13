import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    labelClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className = '', containerClassName = '', labelClassName = '', label, error, ...props }, ref) => {
        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label className={`block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 ml-1 ${labelClassName}`}>
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-inner placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors font-medium disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 ml-1 text-sm text-primary font-bold">{error}</p>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
