import { useState } from 'react';

interface UIState {
  isLoading: boolean;
  isUpdatingRecipe: boolean;
  error: string | null;
  imageFeaturesDisabled: boolean;
}

export const useUIState = () => {
  const [uiState, setUiState] = useState<UIState>({
    isLoading: false,
    isUpdatingRecipe: false,
    error: null,
    imageFeaturesDisabled: false,
  });

  const setLoading = (isLoading: boolean) => {
    setUiState(prev => ({ ...prev, isLoading }));
  };

  const setUpdatingRecipe = (isUpdating: boolean) => {
    setUiState(prev => ({ ...prev, isUpdatingRecipe: isUpdating }));
  };

  const setError = (error: string | null) => {
    setUiState(prev => ({ ...prev, error }));
  };

  const setImageFeaturesDisabled = (disabled: boolean) => {
    setUiState(prev => ({ ...prev, imageFeaturesDisabled: disabled }));
  };

  const clearUI = () => {
    setUiState(prev => ({ ...prev, isLoading: false, isUpdatingRecipe: false, error: null }));
  };

  return {
    uiState,
    setLoading,
    setUpdatingRecipe,
    setError,
    clearUI,
    setImageFeaturesDisabled,
  };
};
