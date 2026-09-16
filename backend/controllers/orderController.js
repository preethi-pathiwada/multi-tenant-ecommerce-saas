import crypto from "crypto";

import Order from "../models/Order.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const {
      store,
      items,
      shippingAddress,
    } = req.body;

    // --------------------------------
    // BASIC VALIDATION
    // --------------------------------

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

    // --------------------------------
    // FIND STORE
    // --------------------------------

    const storeExists = await Store.findById(store);

    if (!storeExists) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    // --------------------------------
    // VALIDATE PRODUCTS
    // --------------------------------

    for (const item of items) {

      if (
        !item.productId ||
        !item.quantity ||
        item.quantity < 1 ||
        !Number.isInteger(item.quantity)
      ) {
        return res.status(400).json({
          message: "Invalid product quantity",
        });
      }

      const product = await Product.findById(
        item.productId
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // --------------------------------
      // IMPORTANT:
      // PRODUCT MUST BELONG TO THIS STORE
      // --------------------------------

      if (
        product.store.toString() !==
        store.toString()
      ) {
        return res.status(400).json({
          message: "Product does not belong to this store",
        });
      }

      let price = product.price;
      let variantName = null;

      // --------------------------------
      // VARIANT PRODUCT
      // --------------------------------

      if (item.variantId) {

        const variant =
          product.variants.id(item.variantId);

        if (!variant) {
          return res.status(404).json({
            message: "Variant not found",
          });
        }

        // Check variant stock
        if (variant.stock < item.quantity) {
          return res.status(400).json({
            message:
              `Insufficient stock for ${product.name} - ${variant.name}`,
          });
        }

        price = variant.price;
        variantName = variant.name;

      } else {

        // --------------------------------
        // NORMAL PRODUCT
        // --------------------------------

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message:
              `Insufficient stock for ${product.name}`,
          });
        }
      }

      // --------------------------------
      // CALCULATE TOTAL
      // --------------------------------

      totalAmount +=
        price * item.quantity;

      // --------------------------------
      // SAVE SNAPSHOT OF PRODUCT DATA
      // --------------------------------

      orderItems.push({
        product: product._id,

        variantId:
          item.variantId || null,

        name: product.name,

        variantName,

        price,

        quantity: item.quantity,
      });
    }

    // --------------------------------
    // CREATE PENDING ORDER
    // --------------------------------

    const order = await Order.create({
      customer: req.user._id,

      store,

      items: orderItems,

      totalAmount,

      shippingAddress,

      status: "PENDING",

      paymentStatus: "PENDING",
    });

    // --------------------------------
    // IMPORTANT:
    // DO NOT REDUCE STOCK HERE
    // --------------------------------

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    // --------------------------------
    // FIND OUR ORDER
    // --------------------------------

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }


    // --------------------------------
    // CHECK ORDER OWNER
    // --------------------------------

    if (
      order.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to verify this order",
      });
    }


    // --------------------------------
    // PREVENT DOUBLE VERIFICATION
    // --------------------------------

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Payment has already been verified",
      });
    }


    // --------------------------------
    // GENERATE EXPECTED SIGNATURE
    // --------------------------------

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");


    // --------------------------------
    // VERIFY SIGNATURE
    // --------------------------------

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }


    // --------------------------------
    // VERIFY STOCK AGAIN
    // --------------------------------

    // Stock may have changed between
    // checkout and successful payment.

    for (const item of order.items) {

      const product =
        await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message:
            `Product ${item.name} no longer exists`,
        });
      }


      // --------------------------------
      // VARIANT STOCK
      // --------------------------------

      if (item.variantId) {

        const variant =
          product.variants.id(
            item.variantId
          );

        if (!variant) {
          return res.status(404).json({
            message:
              `Variant for ${item.name} no longer exists`,
          });
        }

        if (
          variant.stock <
          item.quantity
        ) {
          return res.status(400).json({
            message:
              `Insufficient stock for ${item.name} - ${item.variantName}`,
          });
        }

      } else {

        // --------------------------------
        // NORMAL PRODUCT STOCK
        // --------------------------------

        if (
          product.stock <
          item.quantity
        ) {
          return res.status(400).json({
            message:
              `Insufficient stock for ${item.name}`,
          });
        }
      }
    }


    // --------------------------------
    // REDUCE STOCK
    // --------------------------------

    for (const item of order.items) {

      const product =
        await Product.findById(item.product);

      if (item.variantId) {

        const variant =
          product.variants.id(
            item.variantId
          );

        variant.stock -= item.quantity;

      } else {

        product.stock -= item.quantity;
      }

      await product.save();
    }


    // --------------------------------
    // UPDATE PAYMENT
    // --------------------------------

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.paymentStatus = "PAID";

    order.status = "CONFIRMED";


    await order.save();


    // --------------------------------
    // RESPONSE
    // --------------------------------

    res.status(200).json({
      message:
        "Payment verified successfully",
      order,
    });

  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    res.status(500).json({
      message:
        "Payment verification failed",
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

    const allowedStatuses = [
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Restore stock when cancelling an order
    if (
      status === "CANCELLED" &&
      order.status !== "CANCELLED"
    ) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (!product) {
          continue;
        }

        if (item.variantId) {
          const variant = product.variants.id(item.variantId);

          if (variant) {
            variant.stock += item.quantity;
          }
        } else {
          product.stock += item.quantity;
        }

        await product.save();
      }
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

export const getMyOrderById = async (req, res) => {
  try {
    // console.log("Query params are", req.params)

    const order = await Order.findOne({_id: req.params.id, customer: req.user._id}).populate("store", "name slug");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};




