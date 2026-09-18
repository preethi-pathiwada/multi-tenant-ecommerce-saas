import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import api from "../../services/api";


const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};


const getStatusClasses = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    case "SHIPPED":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "CONFIRMED":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";

    case "CANCELLED":
      return "bg-rose-100 text-rose-700 border-rose-200";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
};


const getPaymentClasses = (status) => {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    case "FAILED":
      return "bg-rose-100 text-rose-700 border-rose-200";

    case "PENDING":
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
};


const SummaryCard = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/55 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
          {icon}
        </div>
      </div>
    </div>
  );
};


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");


  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("FETCH ADMIN ORDERS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };


  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "PAID"
    ).length;

    const pendingOrders = orders.filter(
      (order) => order.paymentStatus === "PENDING"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "DELIVERED"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "CANCELLED"
    ).length;

    const revenue = orders
      .filter(
        (order) =>
          order.paymentStatus === "PAID" &&
          order.status !== "CANCELLED"
      )
      .reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenue,
    };
  }, [orders]);


  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.customer?.name?.toLowerCase() || "";

      const customerEmail =
        order.customer?.email?.toLowerCase() || "";

      const storeName =
        order.store?.name?.toLowerCase() || "";

      const orderId =
        order._id?.toLowerCase() || "";

      const razorpayOrderId =
        order.razorpayOrderId?.toLowerCase() || "";

      const razorpayPaymentId =
        order.razorpayPaymentId?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        storeName.includes(query) ||
        orderId.includes(query) ||
        razorpayOrderId.includes(query) ||
        razorpayPaymentId.includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link
              to="/admin/dashboard"
              className="transition hover:text-cyan-700"
            >
              Admin Dashboard
            </Link>

            <span>/</span>

            <span className="text-slate-700">
              Orders
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
                Order Management
              </p>

              <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Orders
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor customer orders, payments, stores and
                fulfilment activity across the platform.
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1
                ? "order"
                : "orders"}{" "}
              shown
            </div>

          </div>
        </div>


        {/* SUMMARY */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Total Orders"
            value={stats.totalOrders}
            description="All platform orders"
            icon={<FiShoppingBag size={21} />}
          />

          <SummaryCard
            title="Paid Orders"
            value={stats.paidOrders}
            description="Successfully paid"
            icon={<FiCheckCircle size={21} />}
          />

          <SummaryCard
            title="Pending Payment"
            value={stats.pendingOrders}
            description="Awaiting payment"
            icon={<FiClock size={21} />}
          />

          <SummaryCard
            title="Gross Revenue"
            value={formatCurrency(stats.revenue)}
            description="Paid, non-cancelled orders"
            icon={<FiDollarSign size={21} />}
          />

        </div>


        {/* FILTER BAR */}
        <div className="mb-6 rounded-3xl border border-white/80 bg-white/55 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px]">

            <div className="relative">

              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by customer, store, order ID or Razorpay ID..."
                className="w-full rounded-2xl border border-slate-200 bg-white/75 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="ALL">
                All Order Status
              </option>
              <option value="PENDING">
                Pending
              </option>
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


            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(e.target.value)
              }
              className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="ALL">
                All Payment Status
              </option>
              <option value="PAID">
                Paid
              </option>
              <option value="PENDING">
                Pending
              </option>
              <option value="FAILED">
                Failed
              </option>
            </select>

          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading ? (
          <div className="rounded-3xl border border-white/80 bg-white/60 p-12 text-center shadow-sm backdrop-blur-xl">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />

            <p className="text-sm font-medium text-slate-500">
              Loading orders...
            </p>

          </div>
        ) : filteredOrders.length === 0 ? (

          <div className="rounded-3xl border border-white/80 bg-white/60 p-14 text-center shadow-sm backdrop-blur-xl">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiShoppingBag size={25} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredOrders.map((order) => (

              <div
                key={order._id}
                className="group rounded-3xl border border-white/80 bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/75"
              >

                <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] lg:items-center">

                  {/* ORDER */}
                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                        <FiBox size={20} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-black text-slate-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(order.createdAt)}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* CUSTOMER / STORE */}
                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                      {order.customer?.name || "Unknown"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {order.customer?.email || "—"}
                    </p>

                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Store
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {order.store?.name || "Unknown Store"}
                    </p>

                  </div>


                  {/* AMOUNT */}
                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">
                      <FiCreditCard
                        size={13}
                        className="text-slate-400"
                      />

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getPaymentClasses(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                  </div>


                  {/* STATUS */}
                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Order Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <p className="mt-3 text-xs text-slate-500">
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1
                        ? "item"
                        : "items"}
                    </p>

                  </div>


                  {/* VIEW */}
                  <div className="flex lg:justify-end">

                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      View
                      <FiArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};


export default AdminOrders;