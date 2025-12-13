import React, { useState, useRef, useEffect } from 'react';
import type { Recipe, ChatMessage } from '@/types.ts';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { motion } from 'framer-motion';

interface RecipeDisplayProps {
    recipe: Recipe | null;
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isAwaitingResponse: boolean;
}

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end">
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl rounded-tr-none py-3 px-5 max-w-sm shadow-md font-medium">
            {text}
        </div>
    </div>
);

const AiMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-start">
        <div className="bg-slate-200 text-slate-800 rounded-lg rounded-bl-none py-2 px-4 max-w-sm">
            {text}
        </div>
    </div>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
    recipe,
    chatHistory,
    onSendMessage,
    isAwaitingResponse,
}) => {
    const [userMessage, setUserMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    if (!recipe) {
        return null;
    }

    const handleSendClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (userMessage.trim()) {
            onSendMessage(userMessage);
            setUserMessage('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40"
        >
            {recipe.imageUrl && (
                <div className="mb-6">
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.dishName}
                        className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-md mx-auto"
                    />
                </div>
            )}
            <h2 className="text-3xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 pb-4 border-b border-black/5">
                {recipe.dishName}
            </h2>

            {/* Metadata Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                {recipe.prepTime !== undefined && recipe.prepTime !== null && (
                    <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Prep: {recipe.prepTime} min
                    </div>
                )}
                {recipe.cookTime !== undefined && recipe.cookTime !== null && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Cook: {recipe.cookTime} min
                    </div>
                )}
                {recipe.servings && (
                    <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {recipe.servings} Servings
                    </div>
                )}
                {recipe.difficulty && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm capitalize ${recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' : recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        {recipe.difficulty}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                        Ingredients
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                <span className="font-bold">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-3">
                    <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Directions
                    </h3>
                    <ol className="list-decimal list-inside space-y-4 text-slate-700 pl-2">
                        {recipe.directions.map((direction, index) => (
                            <li key={index} className="pl-2 leading-relaxed">
                                {direction}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-semibold text-center text-slate-700 mb-4">
                    Chat with your Kusina Assistant
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 h-64 overflow-y-auto space-y-4 shadow-inner">
                    {chatHistory.map((msg, index) =>
                        msg.sender === 'user' ? (
                            <UserMessage key={index} text={msg.text} />
                        ) : (
                            <AiMessage key={index} text={msg.text} />
                        )
                    )}
                    {isAwaitingResponse && (
                        <div className="flex justify-start">
                            <div className="bg-slate-200 rounded-lg rounded-bl-none py-2 px-4 inline-flex items-center gap-2">
                                <LoadingSpinner />
                                <span className="text-sm text-slate-600">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendClick} className="flex items-center gap-3 mt-4">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="e.g., 'Can I make this vegetarian?'"
                        disabled={isAwaitingResponse}
                        className="flex-grow w-full px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:bg-slate-100"
                        aria-label="Chat with AI assistant"
                    />
                    <button
                        type="submit"
                        disabled={isAwaitingResponse || !userMessage.trim()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all duration-300 disabled:bg-slate-200 disabled:from-transparent disabled:to-transparent disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Send
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </motion.div >
    );
};
