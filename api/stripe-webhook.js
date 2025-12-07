// api/stripe-webhook.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
const fetch = require("node-fetch"); // Vercel Node runtime supports this

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = req.rawBody || req.body; // Vercel supplies raw body
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle relevant events
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.updated" ||
    event.type === "invoice.payment_failed"
  ) {
    const subscription = event.data.object;

    // You must be saving this when you create the subscription
    const stripeSubscriptionId = subscription.id;

    // Mark tenant as inactive in Supabase when subscription ends / fails
    try {
      const supabaseUrl = "https://gmsjqunfsffjiksffvem.supabase.co/rest/v1/Users";
      const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      const status = event.type === "invoice.payment_failed" ? false : (subscription.status !== "active");

      // Update by stripe_subscription_id column
      const response = await fetch(
        `${supabaseUrl}?stripe_subscription_id=eq.${encodeURIComponent(stripeSubscriptionId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          },
          body: JSON.stringify({ is_active: !status ? true : false })
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Supabase update error:", text);
      }
    } catch (err) {
      console.error("Error updating Supabase:", err);
    }
  }

  res.json({ received: true });
};
