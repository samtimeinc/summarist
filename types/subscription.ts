export type subscriptionTier = "basic" | "premium" | "premium-plus";



export interface Subscription {
    tier: subscriptionTier;
    expires: number | null;
    cancelRenew: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}