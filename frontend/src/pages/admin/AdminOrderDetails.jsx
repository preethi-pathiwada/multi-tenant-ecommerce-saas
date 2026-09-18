import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import api from "../../services/api";


const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};


const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
};


const InfoCard = ({
  icon,
  title,
  children,
}) => {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
          {icon}
        </div>

        <h2 className="text-base font-black tracking-tight text-slate-900">
          {title}
        </h2>

      </div>

      {children}

    </div>
  );
};


const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchOrder();
  }, [id]);


  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/orders/${id}`
      );

      setOrder(response.data.order);
    } catch (error) {
      console.error(
        "FETCH ADMIN ORDER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/50">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading order...
          </p>

        </div>

      </div>
    );
  }


  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/50 px-4">

        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <FiBox size={25} />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error || "This order does not exist."}
          </p>

          <Link
            to="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">

          <Link
            to="/admin/orders"
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-cyan-700"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
                Order Details
              </p>

              <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                #{order._id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <FiCalendar size={14} />
                {formatDateTime(order.createdAt)}
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <span
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${getStatusClasses(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${getPaymentClasses(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus}
              </span>

            </div>

          </div>

        </div>


        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          <div className="space-y-6">

            {/* ITEMS */}
            <InfoCard
              icon={<FiPackage size={19} />}
              title="Ordered Items"
            >

              <div className="space-y-4">

                {order.items?.map((item, index) => {

                  const image =
                    item.product?.images?.[0];

                  return (
                    <div
                      key={
                        item._id ||
                        `${item.product?._id}-${index}`
                      }
                      className="flex gap-4 rounded-2xl border border-slate-100 bg-white/70 p-4"
                    >

                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <FiShoppingBag size={24} />
                          </div>
                        )}

                      </div>


                      <div className="min-w-0 flex-1">

                        <h3 className="font-bold text-slate-900">
                          {item.name ||
                            item.product?.name ||
                            "Product"}
                        </h3>

                        {item.variantName && (
                          <p className="mt-1 text-xs text-slate-500">
                            Variant:{" "}
                            {item.variantName}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                          <span>
                            Quantity:{" "}
                            <strong className="text-slate-700">
                              {item.quantity}
                            </strong>
                          </span>

                          <span>•</span>

                          <span>
                            Unit Price:{" "}
                            <strong className="text-slate-700">
                              {formatCurrency(
                                item.price
                              )}
                            </strong>
                          </span>

                        </div>

                      </div>


                      <div className="text-right">

                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 text-base font-black text-slate-900">
                          {formatCurrency(
                            Number(item.price || 0) *
                              Number(item.quantity || 0)
                          )}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>


              {/* TOTAL */}
              <div className="mt-6 border-t border-slate-200 pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-slate-600">
                    Order Total
                  </span>

                  <span className="text-2xl font-black tracking-tight text-slate-950">
                    {formatCurrency(
                      order.totalAmount
                    )}
                  </span>

                </div>

              </div>

            </InfoCard>


            {/* SHIPPING */}
            <InfoCard
              icon={<FiMapPin size={19} />}
              title="Shipping Address"
            >

              {order.shippingAddress ? (
                <div className="grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {order.shippingAddress.name ||
                        "—"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {order.shippingAddress.phone ||
                        "—"}
                    </p>
                  </div>


                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Address
                    </p>
                    <p className="mt-1 leading-6 text-slate-700">
                      {order.shippingAddress.address ||
                        "—"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      City
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {order.shippingAddress.city ||
                        "—"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      State
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {order.shippingAddress.state ||
                        "—"}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Pincode
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {order.shippingAddress.pincode ||
                        "—"}
                    </p>
                  </div>

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No shipping address available.
                </p>
              )}

            </InfoCard>

          </div>


          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* CUSTOMER */}
            <InfoCard
              icon={<FiUser size={19} />}
              title="Customer"
            >

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Name
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {order.customer?.name ||
                      "Unknown"}
                  </p>
                </div>


                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {order.customer?.email ||
                      "—"}
                  </p>
                </div>


                {order.customer?.phone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {order.customer.phone}
                    </p>
                  </div>
                )}

              </div>

            </InfoCard>


            {/* STORE */}
            <InfoCard
              icon={<FiShoppingBag size={19} />}
              title="Store"
            >

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Store Name
                </p>

                <p className="mt-1 font-black text-slate-800">
                  {order.store?.name ||
                    "Unknown Store"}
                </p>

                {order.store?.slug && (
                  <p className="mt-1 text-sm text-slate-500">
                    /{order.store.slug}
                  </p>
                )}

              </div>

            </InfoCard>


            {/* PAYMENT */}
            <InfoCard
              icon={<FiCreditCard size={19} />}
              title="Payment Information"
            >

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Payment Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getPaymentClasses(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>


                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Razorpay Order ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-600">
                    {order.razorpayOrderId ||
                      "Not available"}
                  </p>
                </div>


                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Razorpay Payment ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-600">
                    {order.razorpayPaymentId ||
                      "Not available"}
                  </p>
                </div>

              </div>

            </InfoCard>


            {/* ORDER TIMELINE INFO */}
            <InfoCard
              icon={<FiCheckCircle size={19} />}
              title="Order Information"
            >

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>


                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDateTime(
                      order.createdAt
                    )}
                  </p>
                </div>


                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDateTime(
                      order.updatedAt
                    )}
                  </p>
                </div>

              </div>

            </InfoCard>

          </div>

        </div>

      </div>

    </div>
  );
};


export default AdminOrderDetails;