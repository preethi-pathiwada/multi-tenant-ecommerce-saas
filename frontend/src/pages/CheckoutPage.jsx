import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

import api from "../services/api";
import { clearCart } from "../store/cartSlice";
import CustomerHeader from "./customer/CustomerHeader";


// LOAD RAZORPAY SCRIPT

const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Prevent loading the script multiple times
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};


const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

 
  // CALCULATIONS OF TOTAL PRICE AND ITEMS
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity,0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity,0);

  // FORM CHANGE HANDLER
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  // PLACE ORDER + RAZORPAY

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      const storeId = cartItems[0].store;

      // PREPARE ITEMS

      const items = cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));


  
      // CREATE ORDER
  

      const response = await api.post("/orders",{store: storeId, items, shippingAddress: form,});
      const createdOrder = response.data.order;

      // LOAD RAZORPAY

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert(
          "Unable to load Razorpay. Please check your internet connection and try again."
        );

        setLoading(false);
        return;
      }


      // CREATE RAZORPAY ORDER

      const razorpayResponse = await api.post("/orders/payment/create", {orderId: createdOrder._id},);

      // RAZORPAY OPTIONS

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayResponse.data.amount,
        currency: razorpayResponse.data.currency,
        name: "Preethi's Fashion",
        description: "E-Commerce Purchase",
        order_id: razorpayResponse.data.razorpayOrderId,

        // PAYMENT SUCCESS

        handler: async function (paymentResponse) {
          try {
            // Verify payment on backend
            await api.post("/orders/payment/verify",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
            );

            // ONLY AFTER VERIFICATION OF SUCCESSFUL PAYMENT, CLEARING THE CART
  
            dispatch(clearCart());
            navigate("/order-success");

          } 
          catch (error) {
            console.error("Payment verification error:",error);
            alert(error.response?.data?.message || "Payment verification failed. Please contact support if money was deducted.");
          } 
          finally {
            setLoading(false);
          }
        },

        // CUSTOMER DETAILS
        prefill: {
          name: form.name,
          contact: form.phone,
        },

        // RAZORPAY THEME
        theme: {
          color: "#0d9488",
        },

        // PAYMENT MODAL CLOSED
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };


      // OPEN RAZORPAY
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
          console.error("Razorpay payment failed:",response);
          alert(response.error?.description || "Payment failed. Please try again.");
          setLoading(false);
        }
      );

      razorpay.open();

      // IMPORTANT UPDATE I DID HERE IS:
      // Not clearing the cart here, not navigating here.
      //Both should happen only after successful backend verification
      
    } 
    catch (error) {
      console.error("Checkout error:",error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };


  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-9 w-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.086.835L5.5 6.75m0 0h14.25l-1.5 9H7.25l-1.75-9zm0 0L4.5 3M9 20.25h.008v.008H9v-.008zm8.25 0h.008v.008h-.008v-.008z"
                />
              </svg>

              
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-900">
              Your cart is empty
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Add some products to your cart before
              proceeding to checkout.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-7 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }


  // --------------------------------
  // CHECKOUT UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <CustomerHeader/>
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-medium text-teal-600">
            Secure Checkout
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your delivery details and complete
            your payment securely.
          </p>
        </div>


        {/* MAIN GRID */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* --------------------------------
              SHIPPING FORM
          -------------------------------- */}

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

              {/* SECTION TITLE */}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-semibold text-teal-700">
                  01
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>


              {/* FORM FIELDS */}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>


                {/* PHONE */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>


                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    placeholder="House number, street, area"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>


                {/* CITY */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>


                {/* STATE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    State
                  </label>

                  <input
                    name="state"
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>


                {/* PINCODE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Pincode
                  </label>

                  <input
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    required
                  />
                </div>

              </div>


              {/* SECURITY MESSAGE */}

              <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                <div className="flex gap-3">

                  <div className="mt-0.5 text-teal-600">
                    <ShieldCheckIcon className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Secure payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Your payment will be processed securely
                      through Razorpay.
                    </p>
                  </div>

                </div>
              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                {loading
                  ? "Opening Secure Payment..."
                  : "Continue to Payment"}
              </button>

            </form>
          </div>


          {/* --------------------------------
              ORDER SUMMARY
          -------------------------------- */}

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </span>
              </div>


              {/* PRODUCTS */}

              <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-1">

                {cartItems.map((item) => {
                  const image =
                    item.image ||
                    item.images?.[0] ||
                    null;

                  const itemTotal =
                    item.price *
                    item.quantity;

                  return (
                    <div
                      key={item.cartId}
                      className="flex gap-3"
                    >

                      {/* IMAGE */}

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <div className="flex justify-between gap-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                          </h3>

                          <p className="shrink-0 text-sm font-semibold text-gray-900">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        {item.variantName && (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.variantName}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>

                      </div>
                    </div>
                  );
                })}

              </div>


              {/* TOTALS */}

              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-teal-600">
                    Free
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-semibold text-gray-900">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

              </div>


              {/* BACK TO CART */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                disabled={loading}
                className="mt-5 w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back to Cart
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

