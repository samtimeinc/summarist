export type subscriptionTier = "basic" | "premium" | "premium-plus"

export interface Subscription {
    tier: subscriptionTier;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}