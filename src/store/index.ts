import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import slices
import authSlice from './slices/auth';
import tasksSlice from './slices/tasks';
import projectsSlice from './slices/projects';
import areasSlice from './slices/areas';
import uiSlice from './slices/ui';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
    projects: projectsSlice,
    areas: areasSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export selectors
export * from './selectors';
