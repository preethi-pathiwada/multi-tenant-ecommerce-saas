import Order from "../models/Order.js";
import Product from "../models/Product.js";

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

