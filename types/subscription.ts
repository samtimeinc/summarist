export type subscriptionTier = "free" | "premium"

export interface Subscription {
    tier: subscriptionTier;
}