/* eslint-disable prettier/prettier */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import cors from "cors"
import rateLimit from 'express-rate-limit'
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import colorRoutes from "./routes/colorRoute.js";
import brandRoutes from "./routes/brandRoute.js";
import AppError from "./utils/appError.js";
import globalError from "./controllers/errorController.js";
import reviewRouter from "./routes/reviewRoute.js";
import orderRoute from "./routes/orderRoute.js";
import couponRouter from "./routes/couponRoute.js";
import Order from "./model/orderModel.js";
dotenv.config({ path: "./config.env" });
const app = express();

app.use(helmet());
// For non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

const stripe = new Stripe(process.env.STRIPE_KEY);
const endpointSecret =process.env.WEBHOOK_SECRET
  
// We Stripe Webhook here
// This example uses Express to receive webhooks

// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    if (!sig) {
      return response.status(400).send("Missing stripe-signature header");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret,
      );

      if (event.type === "checkout.session.completed") {
        // Update the order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;
        const order = await Order.findByIdAndUpdate(
          JSON.parse(orderId),
          {
            totalPrice: totalAmount / 100,
            currency,
            paymentStatus,
            paymentMethod,
          },
          {
            new: true,
          },
        );
        console.log(order);
      } else {
        return;
      }
    } catch (err) {
      console.error("Webhook error:", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use("/api",limiter)
app.use(sanitize());
app.use(xss())
app.use(cors())
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/color", colorRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/coupons", couponRouter);

app.all("*", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

app.use(globalError);

export default app;
