import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SerializableUser } from '@/types/serializableUser';

export interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  authIsReady: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  authIsReady: false,
}

export const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
        state.user = action.payload;
        state.loading = false;
        state.authIsReady = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.authIsReady = true;
    },
  },
})

export const { setUser, clearUser } = userAuthSlice.actions
export default userAuthSlice.reducer