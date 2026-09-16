import { useEffect, useState } from "react";
import api from "../../services/api";

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

      // Optimistic UI update
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

      // Revert if API request fails
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
            Vendor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Manage orders placed in your store.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-5">
            <p className="text-sm text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-teal-600">
              {confirmedOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5">
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {shippedOrders}
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {deliveredOrders}
            </p>
          </div>

        </div>

        {/* Orders */}
        <div className="mt-8 space-y-5">

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                <span className="text-2xl">📦</span>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Orders placed by customers will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >

                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm text-gray-700">
                      {order._id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
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
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="grid gap-6 p-5 md:grid-cols-3">

                  {/* Customer */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Customer
                    </p>

                    <p className="mt-2 font-semibold text-gray-900">
                      {order.customer?.name || "Customer"}
                    </p>

                    {order.customer?.email && (
                      <p className="mt-1 break-all text-sm text-gray-500">
                        {order.customer.email}
                      </p>
                    )}
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Payment
                    </p>

                    <p
                      className={`mt-2 font-semibold ${getPaymentStyle(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Order Total
                    </p>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                </div>

                {/* Items */}
                <div className="border-t border-gray-100 bg-gray-50/70 p-5">

                  <p className="text-sm font-semibold text-gray-900">
                    Order Items
                  </p>

                  <div className="mt-4 space-y-3">

                    {order.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4"
                      >

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {item.name}
                          </p>

                          {item.variantName && (
                            <p className="mt-1 text-sm text-gray-500">
                              Variant: {item.variantName}
                            </p>
                          )}

                          <p className="mt-1 text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="ml-4 whitespace-nowrap font-semibold text-gray-900">
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
      </div>
    </div>
  );
};

export default VendorOrders;

