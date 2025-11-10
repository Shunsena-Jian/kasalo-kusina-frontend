import { useState, useCallback } from 'react';
import type { Recipe, ChatMessage } from '../types';

interface AppDataState {
  imageFile: File | null;
  imagePreviewUrl: string | null;
  dishDescription: string;
  recipe: Recipe | null;
  chatHistory: ChatMessage[];
}

export const useAppData = () => {
  const [appData, setAppData] = useState<AppDataState>({
    imageFile: null,
    imagePreviewUrl: null,
    dishDescription: '',
    recipe: null,
    chatHistory: [],
  });

  const resetRecipeAndChat = () => {
    setAppData(prev => ({
      ...prev,
      recipe: null,
      chatHistory: [],
    }));
  };

  const handleImageSelect = useCallback((file: File | null) => {
    if (appData.imagePreviewUrl) {
      URL.revokeObjectURL(appData.imagePreviewUrl);
    }
    setAppData(prev => ({
      ...prev,
      imageFile: file,
      imagePreviewUrl: file ? URL.createObjectURL(file) : null,
    }));
    resetRecipeAndChat();
  }, [appData.imagePreviewUrl]);

  const handleDescriptionChange = useCallback((description: string) => {
    setAppData(prev => ({
        ...prev,
        dishDescription: description,
      }));
    resetRecipeAndChat();
  }, []);

  const handleClear = useCallback(() => {
    if (appData.imagePreviewUrl) {
      URL.revokeObjectURL(appData.imagePreviewUrl);
    }
    setAppData({
      imageFile: null,
      imagePreviewUrl: null,
      dishDescription: '',
      recipe: null,
      chatHistory: [],
    });
  }, [appData.imagePreviewUrl]);

  const setRecipe = (recipe: Recipe | null) => {
    setAppData(prev => ({ ...prev, recipe }));
  };
  
  const addMessageToHistory = (message: ChatMessage) => {
    setAppData(prev => ({...prev, chatHistory: [...prev.chatHistory, message]}));
  };

  const clearChatHistory = () => {
    setAppData(prev => ({...prev, chatHistory: []}));
  };

  return {
    appData,
    handleImageSelect,
    handleDescriptionChange,
    handleClear,
    setRecipe,
    addMessageToHistory,
    clearChatHistory,
  };
};