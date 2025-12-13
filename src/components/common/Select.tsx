import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    containerClassName?: string;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    className = '',
    containerClassName = '',
    placeholder = 'Select an option',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`w-full ${containerClassName}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl shadow-inner transition-colors flex justify-between items-center outline-none ${isOpen
                        ? 'ring-2 ring-primary border-primary'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        } ${className}`}
                >
                    <span className={`font-medium ${!selectedOption ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute z-50 w-full mt-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                        >
                            <ul className="py-1 max-h-60 overflow-auto custom-scrollbar">
                                {options.map((option) => (
                                    <li key={option.value}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${option.value === value
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
