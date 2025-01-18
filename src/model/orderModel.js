import { Schema, model } from "mongoose";

// Generates random numbers
const randmonText = Math.random().toString(36).substring(7);
const randomNumbers = Math.floor(Math.random() * 1000);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [
      {
        type: Object,
        required: [true, "Order Item is required"],
      },
    ],
    shippingAddress: {
      type: Object,
      required: [true, "Shipping Address is required"],
    },
    orderNumber: {
      type: String,
      default: randmonText + randomNumbers,
    },
    //For Stripe Payment
    paymentStatus: {
      type: String,
      default: "Not Specified",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "Not Specified",
    },
    // For admin
    status: {
      type: String,
      enum: ["pending", "shipping", "delivered", "processing"],
      default: "pending",
    },
    deliverAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model("Order", orderSchema);
export default Order;
