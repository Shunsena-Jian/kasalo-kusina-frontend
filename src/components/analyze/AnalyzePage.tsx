import React from 'react';
import { DishInput } from './DishInput';
import { RecipeDisplay } from './RecipeDisplay';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PageTransition } from '../common/PageTransition';
import type { Recipe, ChatMessage } from '@/types.ts';

interface AnalyzePageProps {
    appData: {
        imagePreviewUrl: string | null;
        dishDescription: string;
        recipe: Recipe | null;
        chatHistory: ChatMessage[];
    };
    uiState: {
        isLoading: boolean;
        error: string | null;
        isUpdatingRecipe: boolean;
        imageFeaturesDisabled: boolean;
    };
    isGuest: boolean;
    onImageSelect: (file: File | null) => void;
    onDescriptionChange: (description: string) => void;
    onClear: () => void;
    onAnalyzeClick: () => void;
    onSendMessage: (message: string) => void;
    onNavigateToRegister: () => void;
    onImportRecipe: (recipe: Recipe, imageUrl?: string | null) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
    appData,
    uiState,
    isGuest,
    onImageSelect,
    onDescriptionChange,
    onClear,
    onAnalyzeClick,
    onSendMessage,
    onNavigateToRegister,
    onImportRecipe,
}) => {
    const WelcomeMessage: React.FC = () => (
        <div className="text-center p-8 glass rounded-3xl border border-white/40 shadow-lg">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3">Welcome to Kasalo Kusina!</h2>
            <p className="text-slate-600 text-lg font-medium">
                Ready to discover a recipe? Upload a photo, describe a Filipino dish, or do both to
                get started.
            </p>
        </div>
    );

    return (
        <div className="w-full">
            {!appData.recipe && (
                <div className="glass rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 border border-white/40">
                    <DishInput
                        onImageSelect={onImageSelect}
                        onDescriptionChange={onDescriptionChange}
                        onClear={onClear}
                        imagePreviewUrl={appData.imagePreviewUrl}
                        description={appData.dishDescription}
                        isLoading={uiState.isLoading}
                        isGuest={isGuest}
                        onNavigateToRegister={onNavigateToRegister}
                        imageFeaturesDisabled={uiState.imageFeaturesDisabled}
                    />

                    {(appData.imagePreviewUrl || appData.dishDescription.trim()) && !isGuest && (
                        <div className="flex flex-col items-center">
                            <button
                                onClick={onAnalyzeClick}
                                disabled={uiState.isLoading}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:from-sky-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-all duration-300 disabled:bg-slate-200 disabled:from-transparent disabled:to-transparent disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                {uiState.isLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
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
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                        Find my dish!
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8">
                {uiState.isLoading && (
                    <div className="text-center p-8 bg-white/50 backdrop-blur-xl rounded-2xl border border-black/5">
                        <div className="flex justify-center items-center gap-4 text-indigo-600">
                            <LoadingSpinner />
                            <p className="text-lg">Identifying dish and generating recipe...</p>
                        </div>
                    </div>
                )}
                {uiState.error && !appData.recipe && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-4"
                        role="alert"
                    >
                        {uiState.error}
                    </div>
                )}

                {appData.recipe ? (
                    <div className="space-y-6">
                        {appData.imagePreviewUrl && (
                            <div className="w-full relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-white/40">
                                <img
                                    src={appData.imagePreviewUrl}
                                    alt="Analyzed Dish"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-6 text-white">
                                    <p className="font-medium text-sm text-white/80 uppercase tracking-wider">
                                        Analyzed Dish
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isGuest && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => onImportRecipe(appData.recipe!, appData.imagePreviewUrl)}
                                    className="px-6 py-3 bg-secondary text-white font-bold rounded-full shadow-lg hover:bg-secondary-dark transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Import to Create Recipe
                                </button>
                                <button
                                    onClick={onClear}
                                    className="px-6 py-3 text-slate-600 font-bold hover:text-red-500 transition-colors flex items-center gap-2"
                                >
                                    Analyze New Dish
                                </button>
                            </div>
                        )}
                        <RecipeDisplay
                            recipe={appData.recipe}
                            chatHistory={appData.chatHistory}
                            onSendMessage={onSendMessage}
                            isAwaitingResponse={uiState.isUpdatingRecipe}
                        />
                    </div>
                ) : (
                    !uiState.isLoading &&
                    !appData.imagePreviewUrl &&
                    !appData.dishDescription.trim() && (
                        <PageTransition>
                            <WelcomeMessage />
                        </PageTransition>
                    )
                )}
            </div>
        </div>
    );
};
