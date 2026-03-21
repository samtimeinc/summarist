import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subscriptionTier } from "@/types/subscription";

interface SubscriptionState {
    tier: subscriptionTier;
    loading: boolean;
}

const initialState: SubscriptionState = {
    tier: null,
    loading: true,
};

export const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setSubscription: (state, action: PayloadAction<subscriptionTier>) => {
            state.tier = action.payload;
            state.loading = false;
        },
        clearSubscription: (state) => {
            state.tier = null;
            state.loading = false;
        }
    }
});

export const {setSubscription, clearSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;