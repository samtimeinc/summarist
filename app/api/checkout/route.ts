
import { NextResponse } from "next/server";
import Stripe from "stripe";



const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia"
});



export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1TKVTDQglGJTjDRrFdepXyLr",
                    quantity: 1,
                }
            ],
            mode: "subscription",
            success_url: ``,
            cancel_url: ``,
            customer_email: email,
            client_reference_id: userId,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}