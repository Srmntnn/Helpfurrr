import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/auth/apiSlice';
import authReducer from './features/auth/authSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
}) 