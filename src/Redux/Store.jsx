import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import themeReducer from '../Redux/Slice/themeSlice'; 
import authReducer from '../Redux/Slice/authSlice'; 
import boardReducer from '../Redux/Slice/boardSlice';


const rootReducer = combineReducers({
  user: authReducer,
  theme: themeReducer,
  boards: boardReducer
  
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
