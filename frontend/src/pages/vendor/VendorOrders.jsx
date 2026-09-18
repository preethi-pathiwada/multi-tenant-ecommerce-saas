import { useEffect, useState } from "react";
import api from "../../services/api";
import VendorHeader from "./VendorHeader";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/vendor");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const selectStatus = async (order, event) => {
    const newStatus = event.target.value;
    const previousStatus = order.status;

    try {
      setUpdatingOrder(order._id);

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item._id === order._id
            ? { ...item, status: newStatus }
            : item
        )
      );

      await api.put(
        `/orders/vendor/${order._id}/status`,
        {
          status: newStatus,
        }
      );
    } catch (error) {
      console.error("Failed to update status:", error);

      setOrders((currentOrders) =>
        currentOrders.map((item) =>
          item._id === order._id
            ? { ...item, status: previousStatus }
            : item
        )
      );

      alert(
        error.response?.data?.message ||
          "Failed to update the order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-teal-50 text-teal-700 border-teal-200";

      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "DELIVERED":
        return "bg-green-50 text-green-700 border-green-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "text-green-600";

      case "FAILED":
        return "text-red-600";

      default:
        return "text-yellow-600";
    }
  };

  const totalOrders = orders.length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
        <VendorHeader />

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded-full bg-teal-100" />
            <div className="mt-4 h-10 w-40 rounded-xl bg-slate-200" />
            <div className="mt-3 h-5 w-64 rounded-lg bg-slate-100" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-3xl border border-white/80 bg-white/70"
                />
              ))}
            </div>

            <div className="mt-8 space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-52 rounded-3xl border border-white/80 bg-white/70"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
      <VendorHeader />

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute -left-24 top-96 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        {/* Header */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            Store Management
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Orders
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Manage orders placed in your store.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-300/10 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Total Orders
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                {totalOrders}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                All store orders
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-100/70">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                Confirmed
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight text-teal-700">
                {confirmedOrders}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Confirmed orders
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Shipped
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight text-blue-700">
                {shippedOrders}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Orders on the way
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-100/70">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-300/10 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Delivered
              </p>

              <p className="mt-3 text-4xl font-black tracking-tight text-green-700">
                {deliveredOrders}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Successfully delivered
              </p>
            </div>
          </div>

        </div>

        {/* Orders */}
        <div className="mt-8 space-y-5">

          {orders.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 px-6 py-16 text-center shadow-lg shadow-slate-200/40 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl text-white shadow-lg shadow-teal-200/60">
                  📦
                </div>

                <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                  No orders yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Orders placed by customers will appear here.
                </p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:shadow-xl hover:shadow-cyan-100/40"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

                {/* Order Header */}
                <div className="relative flex flex-col gap-5 border-b border-white/80 bg-gradient-to-r from-white/70 via-cyan-50/20 to-white/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-700">
                      {order._id}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                    <span
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      disabled={updatingOrder === order._id}
                      onChange={(event) =>
                        selectStatus(order, event)
                      }
                      className="rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm font-bold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="CONFIRMED">
                        Confirmed
                      </option>

                      <option value="SHIPPED">
                        Shipped
                      </option>

                      <option value="DELIVERED">
                        Delivered
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>

                  </div>
                </div>

                {/* Order Information */}
                <div className="relative grid gap-6 p-5 sm:p-6 md:grid-cols-3">

                  {/* Customer */}
                  <div className="rounded-2xl border border-white/80 bg-white/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-600">
                      Customer
                    </p>

                    <p className="mt-2 font-black text-slate-900">
                      {order.customer?.name || "Customer"}
                    </p>

                    {order.customer?.email && (
                      <p className="mt-1 break-all text-sm text-slate-500">
                        {order.customer.email}
                      </p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="rounded-2xl border border-white/80 bg-white/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-600">
                      Payment
                    </p>

                    <p
                      className={`mt-2 font-black ${getPaymentStyle(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="rounded-2xl border border-white/80 bg-white/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                      Order Total
                    </p>

                    <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                </div>

                {/* Items */}
                <div className="relative border-t border-white/80 bg-slate-50/50 p-5 sm:p-6">

                  <p className="text-sm font-black text-slate-900">
                    Order Items
                  </p>

                  <div className="mt-4 space-y-3">

                    {order.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between rounded-2xl border border-white/90 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
                      >

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {item.name}
                          </p>

                          {item.variantName && (
                            <p className="mt-1 text-sm text-slate-500">
                              Variant: {item.variantName}
                            </p>
                          )}

                          <p className="mt-1 text-sm font-medium text-slate-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="ml-4 whitespace-nowrap text-base font-black text-slate-950">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>
                    ))}

                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      </main>
    </div>
  );
};

export default VendorOrders;