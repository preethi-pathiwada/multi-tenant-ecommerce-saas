import mongoose from "mongoose";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";



// ==========================================
// ADMIN DASHBOARD
// ==========================================

export const getAdminDashboard = async (req, res) => {
  try {
    // ------------------------------------------
    // PLATFORM COUNTS
    // ------------------------------------------

    const [
      totalVendors,
      totalCustomers,
      totalStores,
      totalProducts,
      totalOrders,
    ] = await Promise.all([
      User.countDocuments({
        role: "VENDOR",
      }),

      User.countDocuments({
        role: "CUSTOMER",
      }),

      Store.countDocuments(),

      Product.countDocuments(),

      Order.countDocuments(),
    ]);


    // ------------------------------------------
    // TOTAL REVENUE
    // Only PAID orders
    // ------------------------------------------

    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
          status: {
            $ne: "CANCELLED",
          },
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


    // ------------------------------------------
    // ORDER STATUS COUNTS
    // ------------------------------------------

    const orderStatusResult = await Order.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const orderStats = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusResult.forEach((item) => {
      const status = item._id?.toLowerCase();

      if (
        status &&
        Object.prototype.hasOwnProperty.call(orderStats, status)
      ) {
        orderStats[status] = item.count;
      }
    });


    // ------------------------------------------
    // RECENT ORDERS
    // ------------------------------------------

    const recentOrders = await Order.find()
      .populate("customer", "name email")
      .populate("store", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "customer store totalAmount status paymentStatus createdAt"
      )
      .lean();


    // ------------------------------------------
    // RECENT VENDORS
    // ------------------------------------------

    const recentVendors = await User.find({
      role: "VENDOR",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "name email isActive isEmailVerified createdAt"
      )
      .lean();


    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.status(200).json({
      stats: {
        totalRevenue,
        totalOrders,
        totalVendors,
        totalCustomers,
        totalStores,
        totalProducts,
      },

      orderStats,

      recentOrders,

      recentVendors,
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      message: "Failed to fetch admin dashboard",
    });
  }
};


// ==========================================
// GET ALL VENDORS
// ==========================================

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "VENDOR",
    })
      .select(
        "name email isActive isEmailVerified createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      vendors,
    });

  } catch (error) {
    console.error("Get vendors error:", error);

    res.status(500).json({
      message: "Failed to fetch vendors",
    });
  }
};


// ==========================================
// TOGGLE VENDOR STATUS
// ==========================================

export const toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "VENDOR",
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    vendor.isActive = !vendor.isActive;

    await vendor.save();

    res.status(200).json({
      message: `Vendor ${
        vendor.isActive
          ? "activated"
          : "deactivated"
      } successfully`,

      vendor,
    });

  } catch (error) {
    console.error("Toggle vendor status error:", error);

    res.status(500).json({
      message: "Failed to update vendor status",
    });
  }
};

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "CUSTOMER",
    })
      .select(
        "name email isActive isEmailVerified createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      customers,
    });

  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};


// ==========================================
// TOGGLE CUSTOMER STATUS
// ==========================================

export const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "CUSTOMER",
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    customer.isActive = !customer.isActive;

    await customer.save();

    res.status(200).json({
      message: `Customer ${
        customer.isActive
          ? "activated"
          : "deactivated"
      } successfully`,

      customer,
    });

  } catch (error) {
    console.error(
      "Toggle customer status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update customer status",
    });
  }
};

// ==========================================
// GET ALL STORES
// ==========================================

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("owner", "name email isActive isEmailVerified")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      stores,
    });

  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      message: "Failed to fetch stores",
    });
  }
};


// ==========================================
// GET SINGLE STORE
// ==========================================

export const getAdminStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate(
        "owner",
        "name email isActive isEmailVerified createdAt"
      )
      .lean();

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.status(200).json({
      store,
    });

  } catch (error) {
    console.error("Get admin store error:", error);

    res.status(500).json({
      message: "Failed to fetch store",
    });
  }
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate(
        "store",
        "name slug owner"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Collect vendor IDs from stores
    const vendorIds = products
      .map((product) => product.store?.owner)
      .filter(Boolean);

    const vendors = await User.find({
      _id: { $in: vendorIds },
      role: "VENDOR",
    })
      .select("name email isActive isEmailVerified")
      .lean();

    // Create quick lookup map
    const vendorMap = new Map(
      vendors.map((vendor) => [
        vendor._id.toString(),
        vendor,
      ])
    );

    const formattedProducts = products.map(
      (product) => ({
        ...product,

        vendor: product.store?.owner
          ? vendorMap.get(
              product.store.owner.toString()
            ) || null
          : null,
      })
    );

    res.status(200).json({
      products: formattedProducts,
    });

  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

export const getAdminProductById = async (
  req,
  res
) => {
  try {
    const product = await Product.findById(
      req.params.id
    )
      .populate(
        "store",
        "name slug owner description"
      )
      .lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let vendor = null;

    if (product.store?.owner) {
      vendor = await User.findOne({
        _id: product.store.owner,
        role: "VENDOR",
      })
        .select(
          "name email isActive isEmailVerified createdAt"
        )
        .lean();
    }

    res.status(200).json({
      product: {
        ...product,
        vendor,
      },
    });

  } catch (error) {
    console.error(
      "Get admin product error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("store", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("GET ALL ADMIN ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};


/* =========================================================
   GET SINGLE ORDER
   GET /api/admin/orders/:id
   ========================================================= */

export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("store", "name slug description owner")
      .populate("items.product", "name images price")
      .lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("GET ADMIN ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};