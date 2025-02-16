import { configureStore } from '@reduxjs/toolkit';
import userReducer from './feature/users/userSlice'
import messageReducer from "./feature/message/messageSlice"


export const store = configureStore({
  reducer: {
    messages : messageReducer,
    users : userReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
