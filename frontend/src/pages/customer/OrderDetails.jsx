import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import CustomerHeader from "./CustomerHeader";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/my-orders/${id}`);

        setOrder(response.data.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-teal-50 text-teal-700 border-teal-200";

      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPaymentStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "w-1/3";

      case "SHIPPED":
        return "w-2/3";

      case "DELIVERED":
        return "w-full";

      default:
        return "w-0";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-64 animate-pulse rounded-3xl bg-white" />

          <div className="mt-5 h-80 animate-pulse rounded-3xl bg-white" />

        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-12">
        <CustomerHeader/>

        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl font-bold text-red-500">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Order not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't find the order you're looking for.
          </p>

          <Link
            to="/my-orders"
            className="mt-6 inline-flex rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Back to My Orders
          </Link>

        </div>

      </div>
    );
  }

  const totalItems =
    order.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  const orderTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <CustomerHeader/>

      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-600"
        >
          <span className="text-lg">←</span>
          Back to My Orders
        </Link>

        {/* Hero */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">

          <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-6 py-8 text-white sm:px-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-teal-50">
                  Order Details
                </p>

                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>

                <p className="mt-2 text-sm text-cyan-50">
                  Placed on {orderDate} at {orderTime}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <span
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

                <span
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${getPaymentStyle(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>

              </div>

            </div>

          </div>

          {/* Delivery Progress */}
          {order.status !== "CANCELLED" && (
            <div className="px-6 py-7 sm:px-8">

              <div className="flex items-center justify-between">

                <div className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    ✓
                  </div>

                  <p className="mt-2 text-xs font-semibold text-teal-700">
                    Confirmed
                  </p>
                </div>

                <div className="mx-3 h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 ${getProgress(
                      order.status
                    )}`}
                  />
                </div>

                <div className="text-center">

                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      order.status === "SHIPPED" ||
                      order.status === "DELIVERED"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    🚚
                  </div>

                  <p
                    className={`mt-2 text-xs font-semibold ${
                      order.status === "SHIPPED" ||
                      order.status === "DELIVERED"
                        ? "text-blue-700"
                        : "text-slate-400"
                    }`}
                  >
                    Shipped
                  </p>

                </div>

                <div className="mx-3 h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 ${
                      order.status === "DELIVERED"
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </div>

                <div className="text-center">

                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    ✓
                  </div>

                  <p
                    className={`mt-2 text-xs font-semibold ${
                      order.status === "DELIVERED"
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    Delivered
                  </p>

                </div>

              </div>

            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                  ×
                </div>

                <div>
                  <p className="font-semibold text-red-800">
                    This order has been cancelled
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    Please contact the store if you have any questions.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Main Grid */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">

          {/* Items */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white lg:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-7">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ordered Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                📦
              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {order.items?.map((item, index) => (

                <div
                  key={item._id || index}
                  className="flex gap-4 px-6 py-5 transition hover:bg-slate-50 sm:px-7"
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 text-xl">
                    🛍️
                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    {item.variantName && (
                      <p className="mt-1 text-sm font-medium text-violet-600">
                        Variant: {item.variantName}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">

                      <span>
                        ₹{item.price} each
                      </span>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                    </div>

                  </div>

                  <div className="shrink-0 text-right">

                    <p className="text-xs text-slate-400">
                      Subtotal
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Total */}
            <div className="border-t border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-6 sm:px-7">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Order Total
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {totalItems}{" "}
                    {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>

                <p className="text-2xl font-bold text-teal-700">
                  ₹{(
                    order.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-5">

            {/* Store */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-lg font-bold text-violet-700">
                  {order.store?.name
                    ? order.store.name
                        .charAt(0)
                        .toUpperCase()
                    : "S"}
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Store
                  </p>

                  <h2 className="mt-1 truncate font-bold text-slate-900">
                    {order.store?.name || "Unknown Store"}
                  </h2>

                </div>

              </div>

            </div>

            {/* Payment */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Payment
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {order.paymentStatus}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                  ✓
                </div>

              </div>

              {order.razorpayPaymentId && (
                <div className="mt-5 border-t border-slate-100 pt-4">

                  <p className="text-xs text-slate-400">
                    Razorpay Payment ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-600">
                    {order.razorpayPaymentId}
                  </p>

                </div>
              )}

            </div>

            {/* Shipping */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  📍
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Shipping Address
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">

                <p className="font-semibold text-slate-900">
                  {order.shippingAddress?.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {order.shippingAddress?.address}
                  <br />
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                  <br />
                  PIN: {order.shippingAddress?.pincode}
                </p>

                <p className="mt-3 text-sm font-medium text-blue-700">
                  📞 {order.shippingAddress?.phone}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <div>
            <p className="font-semibold text-slate-900">
              Looking for another order?
            </p>

            <p className="mt-1 text-sm text-slate-500">
              View your complete purchase history.
            </p>
          </div>

          <Link
            to="/my-orders"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-100 sm:w-auto"
          >
            View All Orders
            <span>→</span>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
