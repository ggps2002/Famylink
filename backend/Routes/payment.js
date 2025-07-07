import User from "../Schema/user.js";
import express from "express";
import Stripe from "stripe";
import { authMiddleware } from "../Services/utils/middlewareAuth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

const router = express.Router();

router.post('/save-card', authMiddleware, async (req, res) => {
    const { paymentMethod } = req.body;

    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Create or retrieve customer
        let customer = await stripe.customers.list({ email: user.email });

        if (!customer.data.length) {
            customer = await stripe.customers.create({ email: user.email });
        } else {
            customer = customer.data[0];
        }

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: customer.id,
        });

        // Save Stripe customer ID to the user in MongoDB
        user.stripeId = customer.id;
        await user.save();

        res.status(200).json({
            message: "Card saved successfully",
            customerId: customer.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/get-save-cards', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Check if user has a Stripe ID
        if (!user.stripeId) {
            return res.status(404).json({ message: "No Cards found for the user!" });
        }

        // List payment methods for the Stripe customer
        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeId,
            type: 'card',  // Assuming you want to retrieve only card payment methods
        });

        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete-card/:paymentMethodId', authMiddleware, async (req, res) => {
    const { paymentMethodId } = req.params;
    const userId = req.userId;
    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Check if user has a Stripe ID
        if (!user.stripeId) {
            return res.status(400).json({ message: "No Stripe customer found for this user." });
        }

        // Detach the payment method from the customer
        await stripe.paymentMethods.detach(paymentMethodId);

        res.status(200).json({ message: "Card removed successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-payment', authMiddleware, async (req, res) => {
    const { paymentMethodId } = req.body;
    const amount = 5000; // Amount in cents (e.g., $50.00)

    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Create or retrieve Stripe customer
        let customer = await stripe.customers.list({ email: user.email });
        if (!customer.data.length) {
            customer = await stripe.customers.create({ email: user.email });
        } else {
            customer = customer.data[0];
        }

        // Create a payment intent with the specified amount and customer ID
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            customer: customer.id,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
            metadata: {
                userId: userId, // Save any relevant info in metadata for later use
            },
        });

        res.status(200).json({
            message: "Payment initiated successfully",
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook endpoint to handle Stripe events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature']; // Extract the signature from the header
    let event;

    try {
        // Verify the webhook signature using the secret stored in process.env
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle event (e.g., payment_intent.succeeded)
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // You can process paymentIntent data here
    }

    res.json({ received: true });
});

export default router;
