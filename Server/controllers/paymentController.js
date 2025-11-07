const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// @desc    Create a Stripe checkout session for a subscription
// @route   POST /api/payments/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    const { priceId } = req.body; // e.g., 'price_1Lxxxxx...' from your Stripe dashboard
    const userId = req.user.id;

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
            metadata: {
                userId: userId,
            },
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(400).json({ error: { message: e.message } });
    }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/payments/webhook
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        
        // Update user's subscription status in the database
        await User.findByIdAndUpdate(userId, {
            'subscription.tier': 'premium', // Or determine tier from the product
            'subscription.stripeCustomerId': session.customer,
            'subscription.expires': null, // For active subscriptions
        });
        console.log(`Subscription activated for user: ${userId}`);
    }
    
    // Add handlers for other events like 'customer.subscription.deleted'

    res.status(200).json({ received: true });
};