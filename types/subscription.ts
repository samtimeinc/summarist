export type subscriptionTier = "free" | "premium" | null

export interface Subscription {
    tier: subscriptionTier;
}