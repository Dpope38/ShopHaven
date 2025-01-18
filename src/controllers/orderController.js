/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";
import Coupon from "../model/couponModel.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import AppError from "../utils/appError.js";

dotenv.config({ path: "./config.env" });

/**
 * @desc Create a new order
 * @route POST /api/v1/orders
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.coupon - Coupon code
 * @param {Object} req.body - Request body
 * @param {Array} req.body.orderItems - List of order items
 * @param {Object} req.body.shippingAddress - Shipping address
 * @param {number} req.body.totalPrice - Total price of the order
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
//Stripe Instance...

const stripe = new Stripe(process.env.STRIPE_KEY);
const createOrder = asyncHandler(async (req, res, next) => {
  const { coupon } = req.query;
  const couponFound = await Coupon.findOne({
    code: coupon.toUpperCase(),
  });
  if (couponFound.isExpired) {
    throw new AppError("Coupon invalid or Expired");
  }
  if (!couponFound) {
    throw new AppError("Coupon does not exist");
  }
  // Get discound
  const discount = couponFound.discount / 100;
  //  Get the payload(shippingAddress, OrderItems, customers, totalPrice),
  const { orderItems, shippingAddress, totalPrice } = req.body; // Good to Go
  // Find the user...
  const user = await User.findById(req.userAuth); // This Line is successful
  if (!user.hasShippingAddress) {
    throw new AppError("Please provide shipping address", 400);
  }
  // console.log(user);
  // console.log(orderItems, shippingAddress, totalPrice);

  // check if order is not empty
  if (orderItems.length <= 0) {
    // throw new Error("No Order Items");
    throw new AppError("No order found! ", 404);
  }
  // place/create order => save into DB

  const order = await Order.create({
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    // status,
    user,
  });
  console.log(order);

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems.map(async (order) => {
    const product = products.find((product) => {
      return product._id.toString() === order._id.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }
    await product.save;
  });

  user.orders.push(order._id);
  await user.save();
  // Convert OrderItem to have same structure with Stripe...

  const convertedOrder = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    };
  });

  // make payment using stripe
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrder,
    metadata: {
      orderId: JSON.stringify(order._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({
    url: session.url,
  });
});

/**
 * @desc Get all orders
 * @route GET /api/v1/orders
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const getAllOrder = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find();
  res.status(200).json({
    message: "Successful",
    data: {
      orders,
    },
  });
});

/**
 * @desc Fetch a single order by ID
 * @route GET /api/v1/orders/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Order ID
 * @param {Object} res - Express response object
 */
const fetchSingleOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    message: "Successful",
    data: {
      order,
    },
  });
});

/**
 * @desc Update an order by ID
 * @route PATCH /api/v1/orders/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Order ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.status - New status of the order
 * @param {Object} res - Express response object
 */
const updateOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  //
  const order = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true },
  );
  res.status(200).json({
    success: true,
    message: "update successful",

    data: {
      order,
    },
  });
});

/**
 * @desc Get sales summary
 * @route GET /api/v1/orders/sales
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSaleSums = asyncHandler(async (req, res) => {
  const sumOfTotalOrder = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  // Get minimum order
  const getMinOrder = await Order.aggregate([
    {
      $group: {
        _id: null,
        minOrder: { $min: "$totalPrice" },
        maxSale: { $max: "$totalPrice" },
      },
    },
  ]);
  res.status(200).json({
    status: true,
    message: "Sale Fetch Successful",
    data: {
      sumOfTotalOrder,
      getMinOrder,
    },
  });
});
export { createOrder, getAllOrder, fetchSingleOrder, updateOrder, getSaleSums };
