import Stripe from "stripe";
import Transaction from "../models/Transition.js";
import User from "../models/User.js";

export const webhookStripe = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECREAT_KEY);
    const sig = request.headers['stripe-signature']

    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECREAT)
    } catch (error) {
        response.status(404).send(`webhook error ${error.messsage}`)
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const peymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: peymentIntent.id
                })
                const session = sessionList.data[0];
                const { transactionId, appId } = session.metadata;

                if (appId === 'quickgpt') {
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })

                    transaction.isPaid = true;
                    await transaction.save();
                } else {
                    return response.json({ success: false, message: error.message });
                }

            }

                break;

            default:
                console.log(`Unhandled event type : ${event.type}`);
                break;

        }

        response.json({ received: true })
    } catch (error) {
        console.log(`Webhook Processing Error ${error}`);

        response.ststus(500).send(`Internal Server Error`)
    }
}