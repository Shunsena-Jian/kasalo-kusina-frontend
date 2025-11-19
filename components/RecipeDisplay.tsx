import React, { useState, useRef, useEffect } from 'react';
import type { Recipe, ChatMessage } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface RecipeDisplayProps {
  recipe: Recipe | null;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isAwaitingResponse: boolean;
  isRateLimited: boolean;
  cooldownMessage: string | null;
}

const MarkdownText: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
    // Simple formatter for bold text only to avoid heavy libraries
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <p className={className}>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </p>
    );
};

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end mb-4 animate-slide-in-right">
        <div className="bg-orange-500 text-white rounded-2xl rounded-tr-sm py-3 px-5 max-w-[85%] shadow-md shadow-orange-100">
            <p className="text-sm md:text-base leading-relaxed">{text}</p>
        </div>
    </div>
);

const AiMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-start mb-4 animate-slide-in-left items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0 mb-1 shadow-md">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.405 0 4.802.173 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
            </svg>
        </div>
        <div className="bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm py-3 px-5 max-w-[85%] shadow-sm">
             <MarkdownText text={text} className="text-sm md:text-base leading-relaxed" />
        </div>
    </div>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, chatHistory, onSendMessage, isAwaitingResponse, isRateLimited, cooldownMessage }) => {
  const [userMessage, setUserMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAwaitingResponse]);

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
    <div className="animate-fade-in space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="relative h-48 md:h-64 bg-slate-100">
            {recipe.imageUrl ? (
                <img 
                    src={recipe.imageUrl} 
                    alt={recipe.dishName} 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-sm mb-1">
                    {recipe.dishName}
                </h2>
                <div className="flex items-center gap-2 text-orange-200 font-medium text-sm">
                    <span className="px-2 py-1 bg-black/30 backdrop-blur-md rounded-md border border-white/10">Filipino Cuisine</span>
                    <span className="px-2 py-1 bg-black/30 backdrop-blur-md rounded-md border border-white/10">Classic Recipe</span>
                </div>
            </div>
        </div>

        <div className="p-6 md:p-8 grid lg:grid-cols-12 gap-10">
            {/* Ingredients Column */}
            <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Ingredients</h3>
                </div>
                <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">{ingredient}</span>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Directions Column */}
            <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                     <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Instructions</h3>
                </div>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {recipe.directions.map((direction, index) => (
                        <div key={index} className="relative flex items-start gap-6 group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white font-bold text-sm shadow-sm z-10 shrink-0 group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm w-full group-hover:bg-white group-hover:shadow-md transition-all">
                                <p className="text-slate-700 leading-relaxed">{direction}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Chef Chat Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-slate-50 p-6 md:p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                    <span className="font-bold text-xl">K</span>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Chef's Table</h3>
                    <p className="text-sm text-slate-500">Ask about substitutions, tips, or wine pairings.</p>
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Questions</p>
                {['Make it spicy', 'What side dish goes well?', 'Vegetarian alternative?'].map(q => (
                    <button 
                        key={q} 
                        onClick={() => onSendMessage(q)}
                        disabled={isAwaitingResponse || isRateLimited}
                        className="block w-full text-left px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors"
                    >
                        {q}
                    </button>
                ))}
             </div>
        </div>

        <div className="flex-1 flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 scrollbar-hide">
                {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>Start a conversation with the chef about this recipe.</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    msg.sender === 'user' 
                    ? <UserMessage key={index} text={msg.text} />
                    : <AiMessage key={index} text={msg.text} />
                ))}
                
                {isAwaitingResponse && (
                    <div className="flex justify-start mb-4 animate-pulse items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="bg-slate-100 h-10 w-24 rounded-2xl rounded-tl-none" />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSendClick} className="relative">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type your question here..."
                        disabled={isAwaitingResponse || isRateLimited}
                        className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-inner placeholder-slate-400 text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={isAwaitingResponse || !userMessage.trim() || isRateLimited}
                        className="absolute right-2 top-2 bottom-2 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
                 {cooldownMessage && <p className="text-xs text-red-500 mt-2 text-center font-medium bg-red-50 py-1 rounded">{cooldownMessage}</p>}
            </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
         @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.3s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};