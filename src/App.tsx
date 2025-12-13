import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { HomePage } from './components/home/HomePage';
import { AnalyzePage } from './components/analyze/AnalyzePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { CreateRecipePage } from './components/recipe/CreateRecipePage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SearchResultsPage } from './components/home/SearchResultsPage';
import { analyzeDish, continueRecipeConversation } from './services/geminiService';
import { useAuthState } from './hooks/useAuthState';
import { useAppData } from './hooks/useAppData';
import { useUIState } from './hooks/useUIState';
import { authService } from './services/authService';
import type { Recipe } from './types';

import { PageTransition } from './components/common/PageTransition';

const App: React.FC = () => {
    const { authState, handleRegisteredLogin, handleGuestLogin, showAuthPage } = useAuthState();
    const { uiState, setLoading, setError, setUpdatingRecipe, clearUI, setImageFeaturesDisabled } =
        useUIState();
    const {
        appData,
        handleImageSelect,
        handleDescriptionChange,
        handleClear,
        setRecipe,
        addMessageToHistory,
        clearChatHistory,
    } = useAppData({
        onClear: () => clearUI(),
    });

    const handleLogout = () => {
        authService.logout();
        navigateAndClear('login');
    };

    const isGuest = authState.userType === 'guest';

    const handleFullClear = () => {
        handleClear();
    };

    const navigateAndClear = (page: 'login' | 'register') => {
        showAuthPage(page);
        handleClear();
    };

    React.useEffect(() => {
        const handleUnauthorized = () => {
            handleLogout();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [handleLogout]);

    const handleAnalyzeClick = async () => {
        if (!appData.imageFile && !appData.dishDescription.trim()) return;

        setLoading(true);
        setError(null);
        setRecipe(null);
        clearChatHistory();

        try {
            const generatedRecipe = await analyzeDish(appData.imageFile, appData.dishDescription);

            if (generatedRecipe.dishName.toLowerCase() === 'unknown dish') {
                setError(
                    "I couldn't identify this dish. Please try another photo or a more specific description of a Filipino dish."
                );
                setRecipe(null);
            } else {
                setRecipe(generatedRecipe);
                // Add a welcome message from the AI to kick off the chat
                addMessageToHistory({
                    sender: 'ai',
                    text: `I've found a recipe for ${generatedRecipe.dishName}! Feel free to ask me any questions or suggest changes.`,
                });
            }
        } catch (err) {
            console.error(err);
            // Check for billing-related errors specifically when an image was used
            if (
                err instanceof Error &&
                appData.imageFile &&
                (err.message.toLowerCase().includes('billing') ||
                    err.message.toLowerCase().includes('permission denied') ||
                    err.message.toLowerCase().includes('quota'))
            ) {
                setError(
                    'Image analysis failed. This feature may require a Gemini API key with billing enabled. You can continue using text descriptions.'
                );
                setImageFeaturesDisabled(true);
                handleImageSelect(null); // Clear the image from the input
            } else {
                setError('An error occurred while analyzing your request. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendChatMessage = async (message: string) => {
        if (!appData.recipe || !message.trim()) return;

        addMessageToHistory({ sender: 'user', text: message });
        setUpdatingRecipe(true);
        setError(null);

        try {
            const result = await continueRecipeConversation(
                appData.recipe,
                appData.chatHistory,
                message
            );
            addMessageToHistory({ sender: 'ai', text: result.responseText });
            if (result.updatedRecipe) {
                setRecipe(result.updatedRecipe);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = 'Sorry, I encountered an error. Please try that again.';
            addMessageToHistory({ sender: 'ai', text: errorMessage });
            setError(errorMessage);
        } finally {
            setUpdatingRecipe(false);
        }
    };

    const [currentView, setCurrentView] = useState<'home' | 'analyze' | 'create-recipe' | 'profile' | 'search'>(() => {
        const savedView = localStorage.getItem('currentView');
        return (savedView as 'home' | 'analyze' | 'create-recipe' | 'profile' | 'search') || 'home';
    });
    const [searchQuery, setSearchQuery] = useState(() => {
        return localStorage.getItem('searchQuery') || '';
    });

    React.useEffect(() => {
        localStorage.setItem('currentView', currentView);
    }, [currentView]);

    React.useEffect(() => {
        localStorage.setItem('searchQuery', searchQuery);
    }, [searchQuery]);

    const handleNavigateToHome = () => {
        setCurrentView('home');
        handleFullClear();
    };

    const handleNavigateToAnalyze = () => {
        setCurrentView('analyze');
        // Don't clear here so users can go back to their analysis
    };

    const handleNavigateToCreateRecipe = () => {
        setCurrentView('create-recipe');
    };

    const handleNavigateToProfile = () => {
        setCurrentView('profile');
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentView('search');
    };

    const handleImportRecipe = (recipe: Recipe, imageUrl?: string | null) => {
        const draft = {
            title: recipe.dishName,
            description: `A delicious recipe for ${recipe.dishName}.`,
            prepTime: recipe.prepTime || '',
            cookTime: recipe.cookTime || '',
            servings: recipe.servings || '',
            difficulty: recipe.difficulty || 'medium',
            ingredients: recipe.ingredients, // Now matches structure
            instructions: recipe.directions.map((step, index) => ({ step: index + 1, text: step })),
            tags: '',
            selectedCategories: [],
            importedImage: imageUrl || recipe.imageUrl // Prioritize passed image URL (user upload), fallback to AI recipe URL
        };
        localStorage.setItem('createRecipeDraft', JSON.stringify(draft));
        setCurrentView('create-recipe');
    };

    const WelcomeMessage: React.FC = () => (
        <div className="text-center p-8 glass rounded-3xl border border-white/40 shadow-lg">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3">Welcome to Kasalo Kusina!</h2>
            <p className="text-slate-600 text-lg font-medium">
                Ready to discover a recipe? Upload a photo, describe a Filipino dish, or do both to
                get started.
            </p>
        </div>
    );

    if (!authState.isAuthenticated) {
        if (authState.page === 'login') {
            return (
                <LoginPage
                    onRegisteredLogin={handleRegisteredLogin}
                    onGuestLogin={handleGuestLogin}
                    onNavigateToRegister={() => showAuthPage('register')}
                    onNavigateToLogin={() => showAuthPage('login')}
                    onNavigateToHome={handleNavigateToHome}
                />
            );
        }
        return (
            <RegisterPage
                onNavigateToLogin={() => showAuthPage('login')}
                onGuestLogin={handleGuestLogin}
                onRegisterSuccess={handleRegisteredLogin}
                onNavigateToRegister={() => showAuthPage('register')}
                onNavigateToHome={handleNavigateToHome}
            />
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Blob Animation */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-br from-light to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 dark:bg-primary/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/30 dark:bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-accent/30 dark:bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>
            <Header
                userType={authState.userType}
                onLogout={handleLogout}
                onNavigateToLogin={() => navigateAndClear('login')}
                onNavigateToRegister={() => navigateAndClear('register')}
                onNavigateToHome={handleNavigateToHome}
                onNavigateToAnalyze={handleNavigateToAnalyze}
                onNavigateToCreateRecipe={handleNavigateToCreateRecipe}
                onNavigateToProfile={handleNavigateToProfile}
                onLogoClick={handleNavigateToHome}
                onSearch={handleSearch}
                currentView={currentView}
            />
            <main className="container mx-auto px-4 pt-24 pb-8 max-w-4xl relative z-10 w-full">
                <PageTransition key={currentView}>
                    {currentView === 'home' ? (
                        <HomePage onAnalyzeClick={handleNavigateToAnalyze} />
                    ) : currentView === 'analyze' ? (
                        <AnalyzePage
                            appData={appData}
                            uiState={uiState}
                            isGuest={isGuest}
                            onImageSelect={handleImageSelect}
                            onDescriptionChange={handleDescriptionChange}
                            onClear={handleFullClear}
                            onAnalyzeClick={handleAnalyzeClick}
                            onSendMessage={handleSendChatMessage}
                            onNavigateToRegister={() => navigateAndClear('register')}
                            onImportRecipe={handleImportRecipe}
                        />
                    ) : currentView === 'create-recipe' ? (
                        <CreateRecipePage onNavigateToHome={handleNavigateToHome} />
                    ) : currentView === 'search' ? (
                        <SearchResultsPage query={searchQuery} onNavigateToHome={handleNavigateToHome} />
                    ) : (
                        <ProfilePage onNavigateToHome={handleNavigateToHome} />
                    )}
                </PageTransition>
            </main>
        </div>
    );
};

export default App;
