import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import {
  UsersIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Supports both:
   *
   * {
   *   stats: {...}
   * }
   *
   * and the older flat response:
   *
   * {
   *   totalVendors,
   *   totalCustomers,
   *   ...
   * }
   */
  const stats = dashboard?.stats || {
    totalRevenue: dashboard?.totalRevenue || 0,
    totalOrders: dashboard?.totalOrders || 0,
    totalVendors: dashboard?.totalVendors || 0,
    totalCustomers: dashboard?.totalCustomers || 0,
    totalStores: dashboard?.totalStores || 0,
    totalProducts: dashboard?.totalProducts || 0,
  };

  const orderStats = dashboard?.orderStats || {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const recentOrders = dashboard?.recentOrders || [];
  const recentVendors = dashboard?.recentVendors || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "DELIVERED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "SHIPPED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "CONFIRMED":
        return "border-cyan-200 bg-cyan-50 text-cyan-700";

      case "CANCELLED":
        return "border-red-200 bg-red-50 text-red-700";

      case "PENDING":
      default:
        return "border-amber-200 bg-amber-50 text-amber-700";
    }
  };

  const statCards = [
    {
      title: "Platform Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "Total processed revenue",
      icon: CurrencyRupeeIcon,
      iconStyle: "from-teal-500 to-cyan-600",
      link: "/admin/orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "Orders across all stores",
      icon: ShoppingBagIcon,
      iconStyle: "from-blue-500 to-cyan-600",
      link: "/admin/orders",
    },
    {
      title: "Vendors",
      value: stats.totalVendors,
      description: "Registered vendors",
      icon: UsersIcon,
      iconStyle: "from-violet-500 to-blue-600",
      link: "/admin/vendors",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      description: "Registered customers",
      icon: UsersIcon,
      iconStyle: "from-cyan-500 to-teal-600",
      link: "/admin/customers",
    },
    {
      title: "Stores",
      value: stats.totalStores,
      description: "Active storefronts",
      icon: BuildingStorefrontIcon,
      iconStyle: "from-indigo-500 to-blue-600",
      link: "/admin/stores",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      description: "Products across stores",
      icon: CubeIcon,
      iconStyle: "from-teal-500 to-emerald-600",
      link: "/admin/stores",
    },
  ];

  const fulfillmentPercentage = stats.totalOrders
    ? Math.min(
        Math.round(
          (orderStats.delivered / stats.totalOrders) * 100
        ),
        100
      )
    : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-white via-cyan-50/80 to-teal-50/80 font-sans text-slate-900">

      {/* =========================================================
          BACKGROUND GLOW
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-300/20 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-300/20 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =======================================================
            HEADER
        ======================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Platform Overview
                </p>
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Admin Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Monitor your entire MarketHub marketplace from one central
                workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/admin/vendors"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:text-teal-700"
              >
                <UsersIcon className="h-4 w-4 text-teal-600" />
                Vendors
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                View Orders
              </Link>

            </div>
          </div>
        </section>

        {/* =======================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-bold text-amber-800">
                Dashboard data unavailable
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                {error}
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              className="rounded-xl border border-amber-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-amber-800 transition hover:bg-white"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =======================================================
            STAT CARDS
        ======================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="group rounded-[1.75rem] border border-slate-200/80 bg-slate-100/80 p-6 shadow-lg shadow-slate-300/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xl"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.iconStyle} shadow-md`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <ArrowRightIcon className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-500" />

                </div>

                <div className="mt-6">

                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-4xl font-semibold leading-[1.05] tracking-[-0.025em] tabular-nums text-slate-950 sm:text-[2.75rem]">
                    {loading ? "—" : stat.value}
                  </p>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                    {stat.description}
                  </p>

                </div>

              </Link>
            );
          })}

        </section>

        {/* =======================================================
            ORDER OVERVIEW + PLATFORM SNAPSHOT
        ======================================================== */}

        <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ORDER OVERVIEW */}

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-100/80 p-6 shadow-lg shadow-slate-300/40 backdrop-blur-xl lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Order Activity
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Order Overview
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 transition hover:text-teal-700"
              >
                View all
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">

              <OrderStat
                icon={ClockIcon}
                value={orderStats.pending}
                label="Pending"
                iconStyle="text-amber-600"
                cardStyle="border-amber-200 bg-amber-50/80"
                loading={loading}
              />

              <OrderStat
                icon={CheckCircleIcon}
                value={orderStats.confirmed}
                label="Confirmed"
                iconStyle="text-cyan-600"
                cardStyle="border-cyan-200 bg-cyan-50/80"
                loading={loading}
              />

              <OrderStat
                icon={TruckIcon}
                value={orderStats.shipped}
                label="Shipped"
                iconStyle="text-blue-600"
                cardStyle="border-blue-200 bg-blue-50/80"
                loading={loading}
              />

              <OrderStat
                icon={CheckCircleIcon}
                value={orderStats.delivered}
                label="Delivered"
                iconStyle="text-emerald-600"
                cardStyle="border-emerald-200 bg-emerald-50/80"
                loading={loading}
              />

              <OrderStat
                icon={XCircleIcon}
                value={orderStats.cancelled}
                label="Cancelled"
                iconStyle="text-red-500"
                cardStyle="border-red-200 bg-red-50/80"
                loading={loading}
              />

            </div>

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between">

                <p className="text-sm font-semibold text-slate-500">
                  Fulfillment progress
                </p>

                <p className="text-sm font-semibold tabular-nums text-slate-700">
                  {fulfillmentPercentage}%
                </p>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transition-all duration-700"
                  style={{
                    width: `${fulfillmentPercentage}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* PLATFORM SNAPSHOT */}

          <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-7 text-white shadow-xl shadow-slate-300/40">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Platform Snapshot
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  MarketHub
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <ArrowTrendingUpIcon className="h-5 w-5 text-cyan-300" />
              </div>

            </div>

            <div className="mt-9">

              <p className="text-4xl font-semibold leading-none tracking-[-0.025em] tabular-nums">
                {formatCurrency(stats.totalRevenue)}
              </p>

              <p className="mt-3 text-sm font-medium text-slate-400">
                Total platform revenue
              </p>

            </div>

            <div className="my-7 h-px bg-white/10" />

            <div className="space-y-5">

              <SnapshotRow
                label="Vendors"
                value={stats.totalVendors}
              />

              <SnapshotRow
                label="Customers"
                value={stats.totalCustomers}
              />

              <SnapshotRow
                label="Stores"
                value={stats.totalStores}
              />

              <SnapshotRow
                label="Products"
                value={stats.totalProducts}
              />

            </div>

            <Link
              to="/admin/settings"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Platform Settings
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

          </div>

        </section>

        {/* =======================================================
            RECENT ORDERS + RECENT VENDORS
        ======================================================== */}

        <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-5">

          {/* RECENT ORDERS */}

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-100/80 p-6 shadow-lg shadow-slate-300/40 backdrop-blur-xl xl:col-span-3">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Latest Activity
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Recent Orders
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 transition hover:text-teal-700"
              >
                All orders
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

            </div>

            <div className="mt-6 overflow-x-auto">

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-16 animate-pulse rounded-xl bg-slate-200/70"
                    />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (

                <EmptyState
                  icon={ShoppingBagIcon}
                  title="No orders yet"
                  description="Orders will appear here once customers place them."
                />

              ) : (

                <div className="min-w-[680px]">

                  <div className="grid grid-cols-5 gap-4 border-b border-slate-200 px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">

                    <span>Order</span>
                    <span>Customer</span>
                    <span>Amount</span>
                    <span>Status</span>
                    <span>Date</span>

                  </div>

                  <div className="divide-y divide-slate-200">

                    {recentOrders.map((order) => (

                      <Link
                        key={order._id}
                        to={`/admin/orders/${order._id}`}
                        className="grid grid-cols-5 items-center gap-4 rounded-xl px-3 py-4 transition hover:bg-slate-50/90"
                      >

                        <span className="text-sm font-bold text-slate-800">
                          #{order._id?.slice(-6)?.toUpperCase()}
                        </span>

                        <span className="truncate text-sm font-medium text-slate-600">
                          {order.customer?.name ||
                            order.user?.name ||
                            "Customer"}
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                          {formatCurrency(
                            order.totalAmount || order.total
                          )}
                        </span>

                        <span
                          className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-bold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status || "PENDING"}
                        </span>

                        <span className="text-sm font-medium text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>

                      </Link>

                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

          {/* RECENT VENDORS */}

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-100/80 p-6 shadow-lg shadow-slate-300/40 backdrop-blur-xl xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                  Marketplace Growth
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Recent Vendors
                </h2>
              </div>

              <Link
                to="/admin/vendors"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200/80 text-slate-500 transition hover:bg-slate-300/80"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Link>

            </div>

            <div className="mt-6 space-y-3">

              {loading ? (

                [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-slate-200/70"
                  />
                ))

              ) : recentVendors.length === 0 ? (

                <EmptyState
                  icon={UsersIcon}
                  title="No vendors yet"
                  description="New vendor registrations will appear here."
                />

              ) : (

                recentVendors.map((vendor) => (

                  <Link
                    key={vendor._id}
                    to={`/admin/vendors/${vendor._id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-sm font-black text-white">
                      {vendor.name?.charAt(0)?.toUpperCase() || "V"}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold text-slate-900">
                        {vendor.name || "Vendor"}
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        {vendor.email}
                      </p>

                    </div>

                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-500" />

                  </Link>

                ))

              )}

            </div>

            <Link
              to="/admin/vendors"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-slate-50/80 px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              Manage Vendors
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

          </div>

        </section>

        {/* =======================================================
            QUICK ACTIONS
        ======================================================== */}

        <section className="mt-7 rounded-[1.75rem] border border-slate-200/80 bg-slate-100/80 p-6 shadow-lg shadow-slate-300/40 backdrop-blur-xl">

          <div className="mb-6">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Administration
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Quick Actions
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              to="/admin/vendors"
              icon={UsersIcon}
              iconStyle="bg-teal-100 text-teal-600"
              title="Manage Vendors"
              description="Accounts & activity"
            />

            <QuickAction
              to="/admin/stores"
              icon={BuildingStorefrontIcon}
              iconStyle="bg-cyan-100 text-cyan-600"
              title="Manage Stores"
              description="Storefront monitoring"
            />

            <QuickAction
              to="/admin/customers"
              icon={UsersIcon}
              iconStyle="bg-blue-100 text-blue-600"
              title="Manage Customers"
              description="Accounts & orders"
            />

            <QuickAction
              to="/admin/orders"
              icon={ShoppingBagIcon}
              iconStyle="bg-violet-100 text-violet-600"
              title="Monitor Orders"
              description="Platform-wide orders"
            />

          </div>

        </section>

        <footer className="py-9 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            MarketHub Platform Administration
          </p>

        </footer>

      </main>

    </div>
  );
};


/* =============================================================
   ORDER STAT
============================================================= */

const OrderStat = ({
  icon: Icon,
  value,
  label,
  iconStyle,
  cardStyle,
  loading,
}) => {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm shadow-slate-200/40 ${cardStyle}`}
    >

      <Icon className={`h-5 w-5 ${iconStyle}`} />

      <p className="mt-5 text-[1.75rem] font-semibold leading-none tracking-[-0.02em] tabular-nums text-slate-950">
        {loading ? "—" : value}
      </p>

      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

    </div>
  );
};


/* =============================================================
   SNAPSHOT ROW
============================================================= */

const SnapshotRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm font-medium text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold tabular-nums text-white">
        {value}
      </span>

    </div>
  );
};


/* =============================================================
   QUICK ACTION
============================================================= */

const QuickAction = ({
  to,
  icon: Icon,
  iconStyle,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/75 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
    >

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-500">
          {description}
        </p>

      </div>

      <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-500" />

    </Link>
  );
};


/* =============================================================
   EMPTY STATE
============================================================= */

const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200">
        <Icon className="h-5 w-5 text-slate-500" />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-600">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
};

export default AdminDashboard;

