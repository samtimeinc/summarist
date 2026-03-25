import { configureStore } from '@reduxjs/toolkit'
import authReducer  from "./userAuthSlice"
import libraryReducer from "./librarySlice"
import subscriptionReducer from "./subscriptionSlice"
import toastReducer from "./toastSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    subscription: subscriptionReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;