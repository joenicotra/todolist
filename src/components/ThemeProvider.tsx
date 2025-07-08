import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setDarkMode } from '../store/slices/ui';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(state => state.ui.theme.isDarkMode);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
    
    const prefersDarkMode = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    
    let shouldUseDarkMode = false;
    
    if (savedTheme) {
      shouldUseDarkMode = savedTheme === 'dark';
    } else {
      shouldUseDarkMode = prefersDarkMode;
    }
    
    if (shouldUseDarkMode !== isDarkMode) {
      dispatch(setDarkMode(shouldUseDarkMode));
    }
  }, [dispatch, isDarkMode]);

  useEffect(() => {
    // Update document class and save preference
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (error) {
        console.warn('Could not save theme to localStorage:', error);
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (error) {
        console.warn('Could not save theme to localStorage:', error);
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Listen for system theme changes
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is saved (respecting user's explicit choice)
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        dispatch(setDarkMode(e.matches));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;