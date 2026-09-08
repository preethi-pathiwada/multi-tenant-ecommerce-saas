import User from "../models/User.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalVendors = await User.countDocuments({
      role: "VENDOR",
    });

    const totalCustomers = await User.countDocuments({
      role: "CUSTOMER",
    });

    const totalStores = await Store.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      totalVendors,
      totalCustomers,
      totalStores,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "VENDOR",
    }).select("name email createdAt");

    res.status(200).json({
      vendors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch vendors",
    });
  }
};