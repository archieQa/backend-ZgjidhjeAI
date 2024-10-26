const Stripe = require("stripe");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Subscription
exports.createSubscription = async (req, res) => {
  const { plan } = req.body; // Expecting 'student' or 'premium'

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Define plan details
    const planId = plan === "student" ? "student_plan_id" : "premium_plan_id"; // Use actual Stripe plan IDs
    const price = plan === "student" ? 1999 : 2999; // Amount in cents (e.g., 1999 = €19.99)

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // Update user plan after successful payment
    user.plan = plan;
    user.dailyTokenLimit = plan === "student" ? 100 : Infinity;
    user.tokensLeft = user.dailyTokenLimit;
    await user.save();

    res.status(200).json({
      success: true,
      subscription,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
