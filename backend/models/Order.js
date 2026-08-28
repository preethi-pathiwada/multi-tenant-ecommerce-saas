import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    store: {type: mongoose.Schema.Types.ObjectId,ref: "Store",required: true,},
    items: [
      {
        product: {type: mongoose.Schema.Types.ObjectId,ref: "Product",required: true,},
        variantId: {type: mongoose.Schema.Types.ObjectId,},
        name: {type: String,required: true,},
        variantName: {type: String,default: null,},
        price: {type: Number,required: true,},
        quantity: {type: Number,required: true,min: 1,},
      },
    ],
    totalAmount: {type: Number,required: true,},

    shippingAddress: {
      name: {type: String,required: true,},
      phone: {type: String, required: true,},
      address: {type: String,required: true,},
      city: {type: String, required: true,},
      state: {type: String,required: true,},
      pincode: {type: String,required: true,},
    },

    status: {type: String, enum: ["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"], default: "PENDING",},

    paymentStatus: {type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING", razorpayOrderId:{type:String}, razorPayPaymentId: {type:String},},
  },
  {timestamps: true,}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;