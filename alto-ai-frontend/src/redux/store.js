import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import spotifyReducer from './spotifySlice';
import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'cookies-js'

const spotifyConfig = {
  key: 'spotify',
  storage: new CookieStorage(Cookies, {
    expiration: {
      default: 60 * 60 * 1000, // 1 hour expiration
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
    spotify: persistReducer(spotifyConfig, spotifyReducer),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  }),
});

export const persistor = persistStore(store);