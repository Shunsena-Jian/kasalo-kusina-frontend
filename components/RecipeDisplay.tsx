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

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-lg rounded-br-none py-2 px-4 max-w-sm">
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


export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, chatHistory, onSendMessage, isAwaitingResponse, isRateLimited, cooldownMessage }) => {
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
    <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in border border-black/5">
      {recipe.imageUrl && (
        <div className="mb-6">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.dishName} 
            className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md mx-auto"
          />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6 pb-4 border-b border-slate-200">
        {recipe.dishName}
      </h2>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Directions
          </h3>
          <ol className="list-decimal list-inside space-y-4 text-slate-700 pl-2">
            {recipe.directions.map((direction, index) => (
              <li key={index} className="pl-2 leading-relaxed">{direction}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-xl font-semibold text-center text-slate-700 mb-4">Chat with your Kusina Assistant</h3>
        <div className="bg-white/50 border border-slate-200 rounded-lg p-4 h-64 overflow-y-auto space-y-4">
            {chatHistory.map((msg, index) => (
                msg.sender === 'user' 
                ? <UserMessage key={index} text={msg.text} />
                : <AiMessage key={index} text={msg.text} />
            ))}
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
            disabled={isAwaitingResponse || isRateLimited}
            className="flex-grow w-full px-4 py-2 bg-white/80 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors disabled:bg-slate-100"
            aria-label="Chat with AI assistant"
          />
          <button
            type="submit"
            disabled={isAwaitingResponse || !userMessage.trim() || isRateLimited}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-lg shadow-md hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-all duration-300 disabled:bg-slate-200 disabled:from-transparent disabled:to-transparent disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            Send
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        {cooldownMessage && <p className="text-sm text-red-600 mt-2 text-center">{cooldownMessage}</p>}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
