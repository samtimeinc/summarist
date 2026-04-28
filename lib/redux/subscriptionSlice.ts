import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserSubscription } from "@/services/subscriptionService";
import { Subscription, subscriptionTier } from "@/types/subscription";

export const getSubscription = createAsyncThunk<Subscription, string>(
  "subscription/fetchUserSubscription",
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await fetchUserSubscription(userId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to find your subscription",
      );
    }
  },
);

interface SubscriptionState {
  tier: subscriptionTier;
  expires: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  tier: "basic",
  expires: null,
  loading: true,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<{ tier: subscriptionTier; expires: number | null}>) => {
      state.tier = action.payload.tier;
      state.expires = action.payload.expires;
      state.loading = false;
      state.error = null;
    },
    clearSubscription: (state) => {
      state.tier = "basic";
      state.expires = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.tier = action.payload.tier;
        state.expires = action.payload.expires;
      })
      .addCase(getSubscription.rejected, (state, action) => {
        state.loading = false;
        state.tier = "basic";
        state.expires = null;
        state.error = action.payload as string;
      });
  },
});

export const { setSubscription, clearSubscription } = subscriptionSlice.actions;

export const selectIsPremiumTier = (state: { subscription: SubscriptionState}) => {
  const tier = state.subscription.tier;
    return tier === "premium" || tier === "premium-plus";
}

export default subscriptionSlice.reducer;
