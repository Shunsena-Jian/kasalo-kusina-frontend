import React from 'react';
import { Header } from './components/Header';
import { DishInput } from './components/DishInput';
import { RecipeDisplay } from './components/RecipeDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { analyzeDish, continueRecipeConversation } from './services/geminiService';
import { useAuthState } from './hooks/useAuthState';
import { useAppData } from './hooks/useAppData';
import { useUIState } from './hooks/useUIState';
import type { Recipe } from './types';

const App: React.FC = () => {
  const { authState, handleRegisteredLogin, handleGuestLogin, showAuthPage } = useAuthState();
  const { uiState, setLoading, setError, setUpdatingRecipe, clearUI, setImageFeaturesDisabled } = useUIState();
  const { 
    appData, 
    handleImageSelect, 
    handleDescriptionChange, 
    handleClear, 
    setRecipe, 
    addMessageToHistory,
    clearChatHistory
  } = useAppData({
    onClear: () => clearUI(),
  });

  const isGuest = authState.userType === 'guest';

  const handleFullClear = () => {
    handleClear();
  };
  
  const navigateAndClear = (page: 'login' | 'register') => {
    showAuthPage(page);
    handleClear();
  };

  const handleAnalyzeClick = async () => {
    if (!appData.imageFile && !appData.dishDescription.trim()) return;
    
    setLoading(true);
    setError(null);
    setRecipe(null);
    clearChatHistory();

    try {
      const generatedRecipe = await analyzeDish(appData.imageFile, appData.dishDescription);
      
      if (generatedRecipe.dishName.toLowerCase() === 'unknown dish') {
        setError("I couldn't identify this dish. Please try another photo or a more specific description of a Filipino dish.");
        setRecipe(null);
      } else {
        setRecipe(generatedRecipe);
        // Add a welcome message from the AI to kick off the chat
        addMessageToHistory({
          sender: 'ai',
          text: `I've found a recipe for ${generatedRecipe.dishName}! Feel free to ask me any questions or suggest changes.`
        });
      }
    } catch (err) {
      console.error(err);
      // Check for billing-related errors specifically when an image was used
      if (err instanceof Error && appData.imageFile && (
          err.message.toLowerCase().includes('billing') || 
          err.message.toLowerCase().includes('permission denied') ||
          err.message.toLowerCase().includes('quota')
        )) {
        setError("Image analysis failed. This feature may require a Gemini API key with billing enabled. You can continue using text descriptions.");
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
        const result = await continueRecipeConversation(appData.recipe, appData.chatHistory, message);
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


  const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 bg-white/50 backdrop-blur-xl rounded-2xl border border-black/5 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600 mb-2">Welcome to Kasalo Kusina!</h2>
      <p className="text-slate-600">Ready to discover a recipe? Upload a photo, describe a Filipino dish, or do both to get started.</p>
    </div>
  );

  if (!authState.isAuthenticated) {
    if (authState.page === 'login') {
      return <LoginPage 
        onRegisteredLogin={handleRegisteredLogin} 
        onGuestLogin={handleGuestLogin} 
        onNavigateToRegister={() => showAuthPage('register')} 
      />;
    }
    return <RegisterPage 
      onNavigateToLogin={() => showAuthPage('login')} 
      onGuestLogin={handleGuestLogin} 
      onRegisterSuccess={handleRegisteredLogin} 
    />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        userType={authState.userType} 
        onLogout={() => navigateAndClear('login')}
        onNavigateToLogin={() => navigateAndClear('login')}
        onNavigateToRegister={() => navigateAndClear('register')}
      />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 space-y-6 border border-black/5">
          <DishInput
            onImageSelect={handleImageSelect}
            onDescriptionChange={handleDescriptionChange}
            onClear={handleFullClear}
            imagePreviewUrl={appData.imagePreviewUrl}
            description={appData.dishDescription}
            isLoading={uiState.isLoading}
            isGuest={isGuest}
            onNavigateToRegister={() => navigateAndClear('register')}
            imageFeaturesDisabled={uiState.imageFeaturesDisabled}
          />

          {(appData.imagePreviewUrl || appData.dishDescription.trim()) && !isGuest && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleAnalyzeClick}
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Find my dish!
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          {uiState.isLoading && (
            <div className="text-center p-8 bg-white/50 backdrop-blur-xl rounded-2xl border border-black/5">
                <div className="flex justify-center items-center gap-4 text-indigo-600">
                    <LoadingSpinner />
                    <p className="text-lg">Identifying dish and generating recipe...</p>
                </div>
            </div>
          )}
          {uiState.error && !appData.recipe && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-4" role="alert">{uiState.error}</div>}
          
          {appData.recipe ? (
            <RecipeDisplay 
                recipe={appData.recipe}
                chatHistory={appData.chatHistory}
                onSendMessage={handleSendChatMessage}
                isAwaitingResponse={uiState.isUpdatingRecipe}
            />
          ) : !uiState.isLoading && !appData.imagePreviewUrl && !appData.dishDescription.trim() && (
            <WelcomeMessage />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
