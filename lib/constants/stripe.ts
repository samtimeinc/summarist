export const STRIPE_PRICES = {
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "",
    YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "",
} as const;

export type StripePriceKey = keyof typeof STRIPE_PRICES;