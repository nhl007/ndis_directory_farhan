"use server";
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY!);

export async function getStripeCheckoutSession() {
  const url = process.env.MAIN_DOMAIN_URL;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${url}/dashboard/payments?success=true`,
    });
    return {
      id: session.id,
    };
  } catch (error) {
    return null;
  }
}
