import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

import api from "../services/api";
import { clearCart } from "../store/cartSlice";
import CustomerHeader from "./customer/CustomerHeader";

// LOAD RAZORPAY SCRIPT
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [form, setForm] = useState(emptyForm);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [previousAddress, setPreviousAddress] = useState(null);

  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [loading, setLoading] = useState(false);

  const [savingPreviousAddress, setSavingPreviousAddress] =
    useState(false);

  const [showManualForm, setShowManualForm] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /*
   * -------------------------------------------------------
   * FETCH SAVED ADDRESSES
   * -------------------------------------------------------
   */

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);

        const response = await api.get("/addresses");

        const savedAddresses = response.data.addresses || [];

        setAddresses(savedAddresses);

        /*
         * If saved addresses exist:
         * automatically select the default address.
         */

        if (savedAddresses.length > 0) {
          const defaultAddress =
            savedAddresses.find(
              (address) => address.isDefault
            ) || savedAddresses[0];

          selectAddress(defaultAddress);
        } else {
          /*
           * No saved addresses.
           * Look at the customer's previous orders.
           */

          try {
            const ordersResponse =
              await api.get("/orders/my-orders");

            const orders =
              ordersResponse.data.orders || [];

            if (orders.length > 0) {
              const latestOrder = [...orders].sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )[0];

              if (latestOrder?.shippingAddress) {
                setPreviousAddress(
                  latestOrder.shippingAddress
                );

                setForm({
                  name:
                    latestOrder.shippingAddress.name || "",
                  phone:
                    latestOrder.shippingAddress.phone || "",
                  address:
                    latestOrder.shippingAddress.address || "",
                  city:
                    latestOrder.shippingAddress.city || "",
                  state:
                    latestOrder.shippingAddress.state || "",
                  pincode:
                    latestOrder.shippingAddress.pincode || "",
                });
              }
            }
          } catch (error) {
            console.error(
              "Previous orders fetch error:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Fetch addresses error:",
          error
        );
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  /*
   * -------------------------------------------------------
   * SELECT SAVED ADDRESS
   * -------------------------------------------------------
   */

  const selectAddress = (address) => {
    setSelectedAddressId(address._id);

    setPreviousAddress(null);

    setShowManualForm(false);

    setForm({
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });
  };

  /*
   * -------------------------------------------------------
   * SELECT PREVIOUS ORDER ADDRESS
   * -------------------------------------------------------
   */

  const selectPreviousAddress = () => {
    if (!previousAddress) return;

    setSelectedAddressId(null);

    setForm({
      name: previousAddress.name || "",
      phone: previousAddress.phone || "",
      address: previousAddress.address || "",
      city: previousAddress.city || "",
      state: previousAddress.state || "",
      pincode: previousAddress.pincode || "",
    });

    setShowManualForm(false);
  };

  /*
   * -------------------------------------------------------
   * FORM CHANGE
   * -------------------------------------------------------
   */

  const handleChange = (e) => {
    setSelectedAddressId(null);
    setPreviousAddress(null);

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /*
   * -------------------------------------------------------
   * SAVE PREVIOUS ADDRESS
   * -------------------------------------------------------
   */

  const savePreviousAddress = async () => {
    if (!previousAddress) return;

    try {
      setSavingPreviousAddress(true);

      const response = await api.post("/addresses", {
        label: "HOME",
        name: previousAddress.name,
        phone: previousAddress.phone,
        address: previousAddress.address,
        city: previousAddress.city,
        state: previousAddress.state,
        pincode: previousAddress.pincode,
        isDefault: true,
      });

      const savedAddress = response.data.address;

      setAddresses((previous) => [
        savedAddress,
        ...previous,
      ]);

      setSelectedAddressId(savedAddress._id);

      setPreviousAddress(null);

      alert("Address saved successfully.");
    } catch (error) {
      console.error(
        "Save previous address error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSavingPreviousAddress(false);
    }
  };

  /*
   * -------------------------------------------------------
   * OPEN MANUAL ADDRESS FORM
   * -------------------------------------------------------
   */

  const handleAddNewAddress = () => {
    setSelectedAddressId(null);

    setPreviousAddress(null);

    setForm(emptyForm);

    setShowManualForm(true);
  };

  /*
   * -------------------------------------------------------
   * CHECKOUT / ORDER CREATION
   * -------------------------------------------------------
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please complete your delivery address.");
      return;
    }

    try {
      setLoading(true);

      const storeId = cartItems[0].store;

      const items = cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      /*
       * Existing order API remains unchanged.
       */

      const response = await api.post("/orders", {
        store: storeId,
        items,
        shippingAddress: form,
      });

      const createdOrder = response.data.order;

      /*
       * LOAD RAZORPAY
       */

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert(
          "Unable to load Razorpay. Please check your internet connection and try again."
        );

        setLoading(false);
        return;
      }

      /*
       * CREATE RAZORPAY ORDER
       */

      const razorpayResponse = await api.post(
        "/orders/payment/create",
        {
          orderId: createdOrder._id,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayResponse.data.amount,

        currency: razorpayResponse.data.currency,

        name: "Preethi's Fashion",

        description: "E-Commerce Purchase",

        order_id:
          razorpayResponse.data.razorpayOrderId,

        handler: async function (paymentResponse) {
          try {
            await api.post(
              "/orders/payment/verify",
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }
            );

            dispatch(clearCart());

            navigate("/order-success");
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support if money was deducted."
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: {
          color: "#0d9488",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );

      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * EMPTY CART
   * -------------------------------------------------------
   */

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">
        <CustomerHeader />

        <main className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20">
          <div className="w-full rounded-[2rem] border border-white/80 bg-white/85 p-10 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 text-3xl">
              🛒
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add some products before proceeding to checkout.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5"
            >
              Continue Shopping
            </Link>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">
      <CustomerHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-6 text-white shadow-xl shadow-cyan-200/40 sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
            Secure checkout
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-sm text-cyan-50 sm:text-base">
            Choose your delivery address and complete your payment securely.
          </p>

        </section>

        <form onSubmit={handleSubmit}>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}

            <div className="space-y-6">

              {/* DELIVERY ADDRESS */}

              <section className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-8">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                      Step 1
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Select where you'd like your order delivered.
                    </p>
                  </div>

                  <Link
                    to="/manage-addresses"
                    className="inline-flex items-center justify-center rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100"
                  >
                    Manage Addresses
                </Link>

                </div>

                {/* ADDRESS LOADING */}

                {loadingAddresses && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-44 animate-pulse rounded-3xl bg-slate-100"
                      />
                    ))}

                  </div>
                )}

                {/* SAVED ADDRESSES */}

                {!loadingAddresses &&
                  addresses.length > 0 && (
                    <div className="mt-6">

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="text-sm font-bold text-slate-800">
                          Saved Addresses
                        </h3>

                        <button
                          type="button"
                          onClick={handleAddNewAddress}
                          className="text-xs font-bold text-teal-600 hover:text-teal-700"
                        >
                          + Add New
                        </button>

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        {addresses.map((item) => {
                          const isSelected =
                            selectedAddressId ===
                            item._id;

                          return (
                            <button
                              type="button"
                              key={item._id}
                              onClick={() =>
                                selectAddress(item)
                              }
                              className={`relative overflow-hidden rounded-3xl border p-5 text-left transition ${
                                isSelected
                                  ? "border-teal-400 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 shadow-lg shadow-teal-100/60"
                                  : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30"
                              }`}
                            >

                              {isSelected && (
                                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-xs font-bold text-white">
                                  ✓
                                </div>
                              )}

                              <div className="flex items-center gap-3">

                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  isSelected
                                    ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}>
                                  {item.label === "HOME"
                                    ? "⌂"
                                    : item.label === "WORK"
                                    ? "▣"
                                    : "◆"}
                                </div>

                                <div>
                                  <p className="text-sm font-black text-slate-900">
                                    {item.label}
                                  </p>

                                  {item.isDefault && (
                                    <span className="mt-1 inline-block rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-700">
                                      Default
                                    </span>
                                  )}
                                </div>

                              </div>

                              <div className="mt-4">

                                <p className="text-sm font-bold text-slate-800">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {item.phone}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                  {item.address}
                                  <br />
                                  {item.city}, {item.state} -{" "}
                                  {item.pincode}
                                </p>

                              </div>

                            </button>
                          );
                        })}

                      </div>

                    </div>
                  )}

                {/* PREVIOUS ORDER ADDRESS */}

                {!loadingAddresses &&
                  addresses.length === 0 &&
                  previousAddress && (
                    <div className="mt-6">

                      <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-5">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="flex items-center gap-2">

                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-sm">
                                ↻
                              </span>

                              <div>
                                <p className="text-sm font-black text-slate-900">
                                  Previous Delivery Address
                                </p>

                                <p className="text-[11px] text-blue-600">
                                  From your recent order
                                </p>
                              </div>

                            </div>

                            <div className="mt-4">

                              <p className="text-sm font-bold text-slate-800">
                                {previousAddress.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {previousAddress.phone}
                              </p>

                              <p className="mt-2 text-xs leading-5 text-slate-600">
                                {previousAddress.address}
                                <br />
                                {previousAddress.city},{" "}
                                {previousAddress.state} -{" "}
                                {previousAddress.pincode}
                              </p>

                            </div>

                          </div>

                          <div className="flex flex-col gap-2">

                            <button
                              type="button"
                              onClick={
                                selectPreviousAddress
                              }
                              className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-200/50 transition hover:-translate-y-0.5"
                            >
                              Use This Address
                            </button>

                            <button
                              type="button"
                              onClick={
                                savePreviousAddress
                              }
                              disabled={
                                savingPreviousAddress
                              }
                              className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
                            >
                              {savingPreviousAddress
                                ? "Saving..."
                                : "Save for Future"}
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                {/* ADD NEW ADDRESS */}

                {!loadingAddresses &&
                  addresses.length === 0 &&
                  !previousAddress &&
                  !showManualForm && (
                    <div className="mt-6 rounded-3xl border border-dashed border-teal-200 bg-gradient-to-br from-teal-50/70 to-cyan-50/70 p-8 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                        ⌂
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-slate-900">
                        Add a delivery address
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        You don't have any saved addresses yet.
                      </p>

                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="mt-5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-200/50"
                      >
                        + Add Address
                      </button>

                    </div>
                  )}

                {/* MANUAL FORM */}

                {(showManualForm ||
                  (addresses.length === 0 &&
                    !previousAddress &&
                    !loadingAddresses)) && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">

                    <div className="mb-5 flex items-center justify-between">

                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          New Delivery Address
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Enter your delivery details below.
                        </p>
                      </div>

                      {showManualForm && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowManualForm(false)
                          }
                          className="text-xs font-bold text-slate-400 hover:text-red-500"
                        >
                          Cancel
                        </button>
                      )}

                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Recipient name"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Address
                        </label>

                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          rows="3"
                          placeholder="House / Flat / Street / Area"
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          City
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Pincode
                        </label>

                        <input
                          type="text"
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                    </div>

                  </div>
                )}

              </section>

              {/* SECURITY */}

              <section className="flex items-start gap-4 rounded-3xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-200/30">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Secure Payment
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your payment is securely processed through Razorpay.
                    We never store your card or payment details.
                  </p>
                </div>

              </section>

            </div>

            {/* RIGHT — ORDER SUMMARY */}

            <aside className="lg:sticky lg:top-6 lg:h-fit">

              <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">

                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white">

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-100">
                    Order summary
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Your Order
                  </h2>

                </div>

                <div className="p-6">

                  <div className="mb-5 flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}
                    </span>

                    <span className="font-bold text-slate-900">
                      ₹{total.toFixed(2)}
                    </span>

                  </div>

                  <div className="space-y-4">

                    {cartItems.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId || "default"}`}
                        className="flex gap-3"
                      >

                        <div className="flex-1">

                          <p className="text-sm font-bold text-slate-800">
                            {item.name}
                          </p>

                          {item.variantName && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {item.variantName}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-slate-500">
                            Qty: {item.quantity}
                          </p>

                        </div>

                        <p className="text-sm font-bold text-violet-600">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>

                      </div>
                    ))}

                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  <div className="flex items-center justify-between">

                    <span className="text-base font-bold text-slate-700">
                      Total
                    </span>

                    <span className="text-2xl font-black text-violet-600">
                      ₹{total.toFixed(2)}
                    </span>

                  </div>

                  <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4">

                    <p className="text-xs font-bold text-emerald-700">
                      ✓ Free delivery
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      No additional shipping charges.
                    </p>

                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Processing..."
                      : "Continue to Payment →"}
                  </button>

                  <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
                    By continuing, you agree to proceed with
                    the purchase and payment.
                  </p>

                </div>

              </section>

            </aside>

          </div>

        </form>

      </main>
    </div>
  );
};

export default CheckoutPage;