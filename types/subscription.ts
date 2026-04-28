export type subscriptionTier = "basic" | "premium" | "premium-plus";



export interface Subscription {
    tier: subscriptionTier;
    expires: number | null;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}