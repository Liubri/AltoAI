import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './authSlice';
import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'cookies-js'

const authConfig = {
  key: 'auth',
  storage: new CookieStorage(Cookies, {
    expiration: {
      default: 30 * 24 * 60 * 60 * 1000,
    },
    setCookieOptions: {
      path: "/",
      sameSite: "strict",
      secure: true,
    },
  }),
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authConfig, authReducer),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  }),
});

export const persistor = persistStore(store);
export default store;