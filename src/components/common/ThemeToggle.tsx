import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
            aria-label="Toggle Dark Mode"
        >
            <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );
};
