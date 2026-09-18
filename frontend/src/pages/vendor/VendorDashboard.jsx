import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VendorHeader from "./VendorHeader";
import api from "../../services/api";

const VendorDashboard = () => {
  const [slug, setSlug] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await api.get("/products/my-store");

        console.log(response.data.products);

        if (response.data.products?.length > 0) {
          setSlug(response.data.products[0].slug);
        }

        setProductCount(response.data.products.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductCount();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <VendorHeader />

      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* =======================================================
            HEADER / INTRO
        ======================================================== */}

        <section className="relative overflow-hidden pb-8 pt-8">

          {/* Background decorative glows */}

          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

            <div className="absolute left-1/3 top-0 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

            <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />

            <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-300/15 blur-3xl" />

          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                Vendor Workspace

              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">

                Vendor Dashboard

              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">

                Manage your store, products and orders from one place.

              </p>

            </div>

            <button
              onClick={() => navigate("/vendor/products/")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Add Product
            </button>

          </div>

        </section>


        {/* =======================================================
            STATS
        ======================================================== */}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Products */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70">

            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl transition duration-300 group-hover:bg-teal-300/20" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                  Products
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {loading ? "—" : productCount}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Products in your store
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200/50 transition duration-300 group-hover:scale-105 group-hover:shadow-lg">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-8.25-4.5-8.25 4.5m16.5 0v9L12 21l-8.25-4.5v-9m16.5 0L12 12 3.75 7.5M12 12v9"
                  />
                </svg>

              </div>

            </div>

          </div>


          {/* Orders */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70">

            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl transition duration-300 group-hover:bg-cyan-300/20" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">
                  Orders
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  0
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Orders received
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-200/50 transition duration-300 group-hover:scale-105 group-hover:shadow-lg">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l2.4 12.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 7H6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 21h.01M18 21h.01"
                  />
                </svg>

              </div>

            </div>

          </div>


          {/* Revenue */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">

            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl transition duration-300 group-hover:bg-blue-300/20" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Revenue
                </p>

                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  ₹0
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Total store revenue
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200/50 transition duration-300 group-hover:scale-105 group-hover:shadow-lg">

                <span className="text-lg font-bold">
                  ₹
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =======================================================
            MAIN DASHBOARD CONTENT
        ======================================================== */}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* =====================================================
              QUICK ACTIONS
          ====================================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-8 lg:col-span-2">

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative">

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Store Management
                </span>

              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Quick Actions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage the most important parts of your store.
              </p>

            </div>


            <div className="relative mt-7 grid gap-4 sm:grid-cols-2">

              {/* =================================================
                  MANAGE PRODUCTS
              ================================================== */}

              <button
                onClick={() => navigate("/vendor/products")}
                className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-teal-50/50 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200/80 hover:shadow-lg hover:shadow-teal-100/70"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200/50 transition duration-300 group-hover:scale-105">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-8.25-4.5-8.25 4.5m16.5 0v9L12 21l-8.25-4.5v-9m16.5 0L12 12 3.75 7.5M12 12v9"
                      />
                    </svg>

                  </div>

                  <span className="text-xl text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-teal-600">
                    →
                  </span>

                </div>

                <h3 className="mt-5 text-base font-black text-slate-900">
                  Manage Products
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add, edit and manage your product catalog.
                </p>

              </button>


              {/* =================================================
                  MY STORE
              ================================================== */}

              <button
                onClick={() => navigate("/vendor/store")}
                className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-cyan-50/50 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200/80 hover:shadow-lg hover:shadow-cyan-100/70"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-200/50 transition duration-300 group-hover:scale-105">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5L12 3l9 7.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 9.75V21h13.5V9.75M9 21v-6h6v6"
                      />
                    </svg>

                  </div>

                  <span className="text-xl text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-600">
                    →
                  </span>

                </div>

                <h3 className="mt-5 text-base font-black text-slate-900">
                  My Store
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View and update your store information.
                </p>

              </button>


              {/* =================================================
                  ORDERS
              ================================================== */}

              <button
                onClick={() => navigate("/vendor/orders")}
                className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-blue-50/50 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-100/70"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200/50 transition duration-300 group-hover:scale-105">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 3h12v18H6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7h6M9 11h6M9 15h4"
                      />
                    </svg>

                  </div>

                  <span className="text-xl text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>

                </div>

                <h3 className="mt-5 text-base font-black text-slate-900">
                  View Orders
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View and manage customer orders.
                </p>

              </button>

            </div>

          </div>


          {/* =====================================================
              STORE STATUS
          ====================================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-8">

            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-teal-300/15 blur-3xl" />

            <div className="relative">

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Store
                </span>

              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Store Status
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your store at a glance.
              </p>


              <div className="mt-7 rounded-3xl border border-teal-100/80 bg-gradient-to-br from-teal-50/90 via-cyan-50/70 to-white/60 p-5">

                <div className="flex items-center gap-3">

                  <span className="relative flex h-3 w-3">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-50" />

                    <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500 shadow-sm shadow-teal-300" />

                  </span>

                  <span className="text-sm font-black text-slate-900">
                    Store Active
                  </span>

                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Your store is ready for customers. Add products and keep
                  your catalog updated.
                </p>

              </div>


              <button
                onClick={() => navigate("/vendor/store")}
                className="mt-5 w-full rounded-2xl border border-teal-200/70 bg-white/80 px-4 py-3.5 text-sm font-bold text-teal-700 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:shadow-md"
              >
                Manage Store
              </button>

            </div>

          </div>

        </section>


        {/* =======================================================
            BOTTOM NOTE
        ======================================================== */}

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-5 shadow-lg shadow-slate-200/30 backdrop-blur-xl sm:p-6">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
              i
            </div>

            <p className="text-sm leading-6 text-slate-500">

              <span className="font-bold text-slate-700">
                Dashboard tip:
              </span>{" "}

              Keep your product information, pricing and stock levels updated
              so customers always see accurate information.

            </p>

          </div>

        </section>

      </main>

    </div>
  );
};

export default VendorDashboard;