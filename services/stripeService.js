/**
const Stripe = require("stripe");
const User = require("../models/User");
const dotenv = require("dotenv");
const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../utils/customErrors");

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is missing");
}

// Create Stripe Subscription
exports.createSubscription = async (req, res, next) => {
  const { plan } = req.body; // Expecting 'student' or 'premium'

  try {
    const user = await User.findById(req.user._id);

    // If user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate the plan input
    if (!["student", "premium"].includes(plan)) {
      throw new BadRequestError("Invalid plan selected");
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
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      return next(error); // Forward known operational errors
    }

    // Wrap other unexpected errors as InternalServerError
    return next(
      new InternalServerError(
        "An error occurred while creating the subscription"
      )
    );
  }
};
*/
