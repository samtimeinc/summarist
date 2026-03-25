import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserSubscription } from "@/services/subscriptionService";
import { subscriptionTier } from "@/types/subscription";



export const getSubscription = createAsyncThunk(
    "subscription/fetchUserSubscription",
    async (userId: string, {rejectWithValue}) => {
        try {
            const tier = await fetchUserSubscription(userId);
            return tier;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to find your subscription");
        }
    }
);

interface SubscriptionState {
    tier: subscriptionTier;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    tier: null,
    loading: true,
    error: null,
};

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        setSubscription: (state, action: PayloadAction<subscriptionTier>) => {
            state.tier = action.payload;
            state.loading = false;
        },
        clearSubscription: (state) => {
            state.tier = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubscription.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.tier = action.payload;
            })
            .addCase(getSubscription.rejected, (state) => {
                state.loading = false;
                state.tier = null;
            })
    }
});

export const {setSubscription, clearSubscription} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;