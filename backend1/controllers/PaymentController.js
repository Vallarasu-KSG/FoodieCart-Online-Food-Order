import OrderModel from "../models/OrderModel.js";
import UserModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing order user for frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:3000";

    try {
        // Creating a new order
        const newOrder = new OrderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        // Clearing the user's cart after placing the order
        await UserModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Mapping items to line items for Stripe Checkout

        // const line_items = req.body.items.map(item => ({
        //     price_data: {
        //         currency: "inr",
        //         product_data: {
        //             name: item.name
        //         },
        //         unit_amount: item.offerPrice * 100 // Make sure this is a valid calculation (no *80 unless required)
        //     },
        //     quantity: item.quantity
        // }));

        // Adding delivery charges as a line item

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 // Assuming $2 as delivery charges in cents (no *80 here)
            },
            quantity: 1
        });

        // Creating the Stripe checkout session
        const session = await checkout.sessions.create({
        // const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",  // Correct lowercase mode
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Responding with the session URL for redirect
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        // Improved error handling (including logging the error message)
        console.error('Error placing order:', error.message);
        res.json({ success: false, message: "Error processing payment" });
    }
};

export { placeOrder };
