import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import CustomerHeader from "./CustomerHeader";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700";

      case "SHIPPED":
        return "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700";

      case "DELIVERED":
        return "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700";

      case "CANCELLED":
        return "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 text-red-700";

      case "PENDING":
        return "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  const getPaymentStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700";

      case "FAILED":
        return "border-red-200 bg-gradient-to-r from-red-50 to-rose-50 text-red-700";

      default:
        return "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700";
    }
  };

  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (order) =>
      order.status === "CONFIRMED" ||
      order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const totalSpent = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/40 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="h-9 w-52 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>

          <div className="mt-8 space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <CustomerHeader/>

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-6 py-8 text-white shadow-xl shadow-teal-100/50 sm:px-8">

          {/* Decorative circles */}
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-50">
                Customer Account
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
                Track your purchases, payment status and delivery progress.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-teal-700"
            >
              Continue Shopping
              <span className="ml-2">→</span>
            </Link>

          </div>

        </div>

        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Orders */}
          <div className="group rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/60">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-teal-700">
                  {totalOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-xl text-white shadow-md shadow-teal-200">
                📦
              </div>

            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-teal-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            </div>

          </div>

          {/* Active Orders */}
          <div className="group rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {activeOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl text-white shadow-md shadow-blue-200">
                🚚
              </div>

            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>

          </div>

          {/* Delivered */}
          <div className="group rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/60">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  {deliveredOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-xl text-white shadow-md shadow-emerald-200">
                ✓
              </div>

            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            </div>

          </div>

          {/* Total Spent */}
          <div className="group rounded-3xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Spent
                </p>

                <p className="mt-2 text-2xl font-bold text-violet-700">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-lg font-bold text-white shadow-md shadow-violet-200">
                ₹
              </div>

            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-violet-100">
              <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
            </div>

          </div>

        </div>

        {/* Order History */}
        <div className="mt-10">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                Purchase History
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Your Orders
              </h2>
            </div>

            {orders.length > 0 && (
              <span className="w-fit rounded-full border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-1.5 text-xs font-bold text-teal-700">
                {orders.length}{" "}
                {orders.length === 1 ? "Order" : "Orders"}
              </span>
            )}

          </div>

          {orders.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 text-3xl">
                🛍️
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You haven't placed an order yet. Explore the stores
                and products available on the platform.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700"
              >
                Start Shopping
                <span>→</span>
              </Link>

            </div>

          ) : (

            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/60"
                >

                  {/* Colored top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />

                  <div className="p-5 sm:p-6">

                    {/* Order header */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-600">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </div>

                        <div className="mt-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                              🏪
                            </div>

                            <p className="font-bold text-slate-900">
                              {order.store?.name || "Unknown Store"}
                            </p>

                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            Placed on{" "}
                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Date unavailable"}
                          </p>

                        </div>

                      </div>

                      {/* Payment */}
                      <div className="flex flex-col items-start gap-2 lg:items-end">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Payment Status
                        </p>

                        <span
                          className={`rounded-full border px-4 py-1.5 text-xs font-bold ${getPaymentStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>

                      </div>

                    </div>

                    {/* Summary */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">

                      <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                          Items
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {order.items?.length || 0}{" "}
                          <span className="text-sm font-medium text-slate-500">
                            {order.items?.length === 1
                              ? "item"
                              : "items"}
                          </span>
                        </p>

                      </div>

                      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                          Order Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-violet-700">
                          ₹{(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">

                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                          Status
                        </p>

                        <p className="mt-1 text-lg font-bold text-blue-700">
                          {order.status}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-cyan-50/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                    <p className="break-all text-xs text-slate-400">
                      Order ID:{" "}
                      <span className="font-mono text-slate-500">
                        {order._id}
                      </span>
                    </p>

                    <Link
                      to={`/my-orders/${order._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-teal-100 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg sm:w-auto"
                    >
                      View Order Details
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default MyOrders;

