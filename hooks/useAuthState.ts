import { useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userType: 'guest' | 'registered' | null;
  page: 'login' | 'register';
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    page: 'login',
  });

  const handleRegisteredLogin = () => {
    setAuthState(prev => ({ ...prev, isAuthenticated: true, userType: 'registered' }));
  };

  const handleGuestLogin = () => {
    setAuthState(prev => ({ ...prev, isAuthenticated: true, userType: 'guest' }));
  };
  
  const showAuthPage = (page: 'login' | 'register') => {
    setAuthState({ isAuthenticated: false, userType: null, page });
  };

  return {
    authState,
    handleRegisteredLogin,
    handleGuestLogin,
    showAuthPage,
  };
};