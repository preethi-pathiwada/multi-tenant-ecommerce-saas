import crypto from "crypto";

import Order from "../models/Order.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import razorpay from "../config/razorpay.js";

//{customer, store, items:[{productId, variantId, name, price, quantity}], totalAmount, shippingAddress:{name, phone, address, city, state, pincode}, status, paymentStatus}

export const createOrder = async (req, res) => {
  try {
    const {store, items, shippingAddress} = req.body;
    console.log(store)

    if (!store || !items || items.length === 0) {
      return res.status(400).json({
        message: "Store and items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.productId
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      let price = product.price;
      let variantName = null;

      if (item.variantId) {
        const variant = product.variants.id(       //MongoDb has a method to find a specific resource in its sub documents through id()
          item.variantId
        );

        if (!variant) {
          return res.status(404).json({
            message: "Variant not found",
          });
        }

        price = variant.price;
        variantName = variant.name;
      }

      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        variantId: item.variantId || null,
        name: product.name,
        variantName,
        price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      store,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to pay for this order",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    console.log(order);

    res.status(200).json({
      message: "Razorpay order created",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
  
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

    console.log(req.body);
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to verify this order",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    order.razorpayPaymentId = razorpay_payment_id;

    order.paymentStatus = "PAID";
    order.status = "CONFIRMED";

    await order.save();

    res.status(200).json({
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};


//Need to implement webhook logic here which I'll later after the backend deployment

export const getVendorOrders = async (req, res) => {
  try {
    const store = await Store.findOne({owner: req.user._id,});

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const orders = await Order.find({
      store: store._id,
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch vendor orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      store: store._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const allowedStatuses = ["CONFIRMED","SHIPPED", "DELIVERED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("store", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};


