import React, { useState, useCallback, useRef } from 'react';
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

  // --- Rate Limiter Logic ---
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isFreeTier, setIsFreeTier] = useState(false);
  const requestTimestamps = useRef<number[]>([]);
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);

  const RATE_LIMIT_COUNT = 15;
  const RATE_LIMIT_WINDOW_MS = 60 * 1000;

  const checkAndRecordRequest = useCallback((): boolean => {
      if (!isFreeTier) {
          return true; 
      }

      const now = Date.now();
      
      requestTimestamps.current = requestTimestamps.current.filter(
          timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
      );

      if (requestTimestamps.current.length >= RATE_LIMIT_COUNT) {
          const oldestRequest = requestTimestamps.current[0];
          const secondsToWait = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestRequest)) / 1000);
          setCooldownMessage(`Rate limit reached. Please wait ${secondsToWait} seconds.`);
          setIsRateLimited(true);
          
          setTimeout(() => {
              setIsRateLimited(false);
              setCooldownMessage(null);
          }, secondsToWait * 1000);

          return false;
      }

      requestTimestamps.current.push(now);
      setIsRateLimited(false);
      setCooldownMessage(null);
      return true;
  }, [isFreeTier]);

  const activateFreeTierMode = useCallback(() => {
      if (!isFreeTier) {
          setIsFreeTier(true);
      }
  }, [isFreeTier]);
  // --- End Rate Limiter Logic ---

  const isGuest = authState.userType === 'guest';

  const handleFullClear = () => {
    handleClear();
  };
  
  const navigateAndClear = (page: 'login' | 'register') => {
    showAuthPage(page);
    handleClear();
  };

  const handleLogoClick = () => {
    if (authState.isAuthenticated) {
        // If authenticated, just refresh the session (clear current view)
        handleFullClear();
    } else {
        // If not authenticated, go to login
        showAuthPage('login');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!appData.imageFile && !appData.dishDescription.trim()) return;
    
    if (!checkAndRecordRequest()) return;

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
        addMessageToHistory({
          sender: 'ai',
          text: `Magandang araw! I've found a delicious recipe for **${generatedRecipe.dishName}**! I'm here to help you cook it perfectly. Do you have any questions about the ingredients?`
        });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        const lowerCaseError = err.message.toLowerCase();
        if (lowerCaseError.includes('429') || lowerCaseError.includes('quota')) {
            activateFreeTierMode();
            setError("It looks like you're using a free tier API key. To prevent errors, requests will now be rate-limited. Please try again in a moment.");
        } else if (appData.imageFile && (
            lowerCaseError.includes('billing') || 
            lowerCaseError.includes('permission denied')
          )) {
          setError("Image analysis failed. This feature may require a Gemini API key with billing enabled. You can continue using text descriptions.");
          setImageFeaturesDisabled(true);
          handleImageSelect(null);
        } else {
          setError('An error occurred while analyzing your request. Please try again.');
        }
      } else {
         setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async (message: string) => {
    if (!appData.recipe || !message.trim()) return;

    if (!checkAndRecordRequest()) return;

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
        let errorMessage = 'Sorry, I encountered an error. Please try that again.';
        if (err instanceof Error && (err.message.toLowerCase().includes('429') || err.message.toLowerCase().includes('quota'))) {
            activateFreeTierMode();
            errorMessage = "Rate limit reached. Please wait a moment before sending another message.";
        }
        addMessageToHistory({ sender: 'ai', text: errorMessage });
        setError(errorMessage);
    } finally {
        setUpdatingRecipe(false);
    }
  };


  if (!authState.isAuthenticated) {
    if (authState.page === 'login') {
      return <LoginPage 
        onRegisteredLogin={handleRegisteredLogin} 
        onGuestLogin={handleGuestLogin} 
        onNavigateToRegister={() => showAuthPage('register')} 
        onLogoClick={() => showAuthPage('login')}
      />;
    }
    return <RegisterPage 
      onNavigateToLogin={() => showAuthPage('login')} 
      onGuestLogin={handleGuestLogin} 
      onRegisterSuccess={handleRegisteredLogin} 
      onLogoClick={() => showAuthPage('login')}
    />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        userType={authState.userType} 
        onLogout={() => navigateAndClear('login')}
        onNavigateToLogin={() => navigateAndClear('login')}
        onNavigateToRegister={() => navigateAndClear('register')}
        onLogoClick={handleLogoClick}
      />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        
        {isFreeTier && (
            <div className="max-w-3xl mx-auto mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md shadow-sm text-sm flex items-center gap-3" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p><span className="font-bold">Free Tier Active:</span> Requests are limited to 15 per minute.</p>
            </div>
        )}

        {/* Input Section */}
        <div className={`transition-all duration-700 ease-in-out ${appData.recipe ? 'hidden' : 'block'}`}>
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
                <div className="flex flex-col items-center mt-8 animate-fade-in">
                <button
                    onClick={handleAnalyzeClick}
                    disabled={uiState.isLoading || isRateLimited}
                    className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-xl shadow-slate-400/30 hover:bg-orange-600 hover:shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                    {uiState.isLoading ? (
                    <>
                        <LoadingSpinner />
                        Cooking up results...
                    </>
                    ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find Recipe
                    </>
                    )}
                </button>
                {cooldownMessage && <p className="text-sm text-red-500 mt-3 font-medium">{cooldownMessage}</p>}
                </div>
            )}
        </div>

        {/* Results Section */}
        <div className="mt-6">
          {uiState.isLoading && (
             <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <p className="text-xl font-medium text-slate-600">The chef is identifying your dish...</p>
                <p className="text-slate-400 text-sm mt-2">Using Gemini 2.5 Flash Lite Reasoning</p>
            </div>
          )}

          {uiState.error && !appData.recipe && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center mb-8 shadow-sm" role="alert">
                <p className="font-semibold">{uiState.error}</p>
            </div>
          )}
          
          {appData.recipe && (
             <div className="relative">
                 <button 
                    onClick={handleFullClear}
                    className="absolute -top-12 left-0 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Search
                 </button>
                <RecipeDisplay 
                    recipe={appData.recipe}
                    chatHistory={appData.chatHistory}
                    onSendMessage={handleSendChatMessage}
                    isAwaitingResponse={uiState.isUpdatingRecipe}
                    isRateLimited={isRateLimited}
                    cooldownMessage={cooldownMessage}
                />
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Kasalo Kusina &bull; Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;