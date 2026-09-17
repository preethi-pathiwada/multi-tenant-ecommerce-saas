import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerHeader from "./customer/CustomerHeader";
import api from "../services/api";

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get currently logged-in user
  const user = useSelector((state) => state.auth.user);

  // Only a CUSTOMER should receive the logged-in customer experience.
  const isCustomer = user?.role === "CUSTOMER";

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");

        const storeData =
          response.data?.stores ||
          response.data?.data ||
          response.data ||
          [];

        setStores(Array.isArray(storeData) ? storeData : []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="px-4 pt-5 sm:px-6 lg:px-8">
        {isCustomer ? <CustomerHeader /> : <GuestHeader />}
      </div>


      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* =======================================================
            HERO
        ======================================================== */}

        <section className="relative overflow-hidden pb-16 pt-4 sm:pb-20 lg:pb-24">

          {/* Background decorative glows */}

          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl sm:h-96 sm:w-96" />

            <div className="absolute -left-24 top-32 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />

            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-300/15 blur-3xl" />

          </div>


          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">

            {/* ===================================================
                HERO CONTENT
            ==================================================== */}

            <div className="max-w-3xl">

              {/* Welcome badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                {isCustomer
                  ? `Welcome back, ${user?.name || "Customer"}`
                  : "Welcome to MarketHub"}

              </div>


              {/* Main heading */}

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

                Discover stores.

                <span className="mt-2 block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Find what you love.
                </span>

              </h1>


              {/* Description */}

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                Explore independent stores, discover unique products and
                enjoy a simple shopping experience — all in one marketplace.

              </p>


              {/* =================================================
                  MAIN CTA
              ================================================== */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/stores"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80"
                >
                  Browse Stores

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>


                {/* Show Login/Register only to visitors */}

                {!isCustomer && (
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/75 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:text-teal-700"
                  >
                    Sign in to shop
                  </Link>
                )}

              </div>


              {/* Supporting information */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    ✓
                  </span>

                  Independent Stores

                </div>


                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    ✓
                  </span>

                  Secure Shopping

                </div>


                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    ✓
                  </span>

                  Easy Checkout

                </div>

              </div>

            </div>


            {/* ===================================================
                HERO VISUAL
            ==================================================== */}

            <div className="relative mx-auto w-full max-w-lg">

              <div className="relative aspect-square">

                {/* Outer glass card */}

                <div className="absolute inset-4 rounded-[2.5rem] border border-white/80 bg-white/60 shadow-2xl shadow-cyan-200/40 backdrop-blur-2xl" />


                {/* Main gradient panel */}

                <div className="absolute inset-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 p-8 shadow-xl">

                  <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/20 blur-3xl" />

                  <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />


                  <div className="relative flex h-full flex-col justify-between">

                    <div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl text-white backdrop-blur-md">
                        🛍️
                      </div>


                      <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        MarketHub Marketplace
                      </p>


                      <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                        Explore.
                        <br />
                        Discover.
                        <br />
                        Shop.
                      </h2>

                    </div>


                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-xs font-semibold text-white/60">
                            Your shopping destination
                          </p>

                          <p className="mt-1 text-sm font-bold text-white">
                            Stores • Products • Orders
                          </p>

                        </div>


                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                          →
                        </span>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Floating store card */}

                <div className="absolute left-0 top-14 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-slate-300/40 backdrop-blur-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                      🏪
                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-800">
                        Explore Stores
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Discover something new
                      </p>

                    </div>

                  </div>

                </div>


                {/* Floating cart card */}

                <div className="absolute bottom-8 right-0 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-slate-300/40 backdrop-blur-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                      🛒
                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-800">
                        Easy Shopping
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Simple & connected
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =======================================================
            STORE DISCOVERY
        ======================================================== */}

        <section className="py-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Discover
                </span>

              </div>


              <h2 className="text-3xl font-black text-left tracking-tight text-slate-900 sm:text-4xl">
                Explore stores
              </h2>


              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Find a store, explore its products and start shopping.
              </p>

            </div>


            <Link
              to="/stores"
              className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-teal-600 transition hover:bg-teal-50"
            >
              View all stores
              <span>→</span>
            </Link>

          </div>


          {/* Store cards */}

          <div className="mt-8">

            {loading ? (

              <StoreSkeleton />

            ) : stores.length === 0 ? (

              <EmptyStores />

            ) : (

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {stores.slice(0, 6).map((store) => (
                  <StoreCard
                    key={store._id}
                    store={store}
                  />
                ))}

              </div>

            )}

          </div>

        </section>


        {/* =======================================================
            HOW MARKETPLACE WORKS
        ======================================================== */}

        <section className="py-16">

          <div className="mb-8 text-center flex flex-col justify-center items-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
              Shopping made simple
            </p>


            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your shopping journey
            </h2>


            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              From discovering a store to completing your order, everything
              stays connected.
            </p>

          </div>


          <div className="grid gap-4 md:grid-cols-4">

            <JourneyCard
              number="01"
              icon="🏪"
              title="Discover"
              description="Browse stores available on MarketHub."
            />

            <JourneyCard
              number="02"
              icon="🔎"
              title="Explore"
              description="Open a store and explore its products."
            />

            <JourneyCard
              number="03"
              icon="🛒"
              title="Shop"
              description="Choose products and add them to your cart."
            />

            <JourneyCard
              number="04"
              icon="📦"
              title="Order"
              description="Complete checkout and track your order."
            />

          </div>

        </section>


        {/* =======================================================
            FINAL CTA
        ======================================================== */}

        <section className="pb-8">

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-12 shadow-xl sm:px-10 lg:px-14">

            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />


            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
                  MarketHub
                </p>


                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">

                  {isCustomer
                    ? "Ready to discover something new?"
                    : "Discover your next favorite store."}

                </h2>


                <p className="mt-3 text-sm leading-6 text-slate-400">

                  Explore our stores and find products from independent
                  businesses on MarketHub.

                </p>

              </div>


              <Link
                to="/stores"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore Stores
                <span>→</span>
              </Link>

            </div>

          </div>

        </section>


        {/* =======================================================
            FOOTER
        ======================================================== */}

        <footer className="border-t border-white/70 py-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <Link
                to="/"
                className="text-lg font-black tracking-tight text-slate-900"
              >
                Market
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Hub
                </span>
              </Link>


              <p className="mt-1 text-xs text-slate-400">
                A modern multi-tenant e-commerce marketplace.
              </p>

            </div>


            <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-500">

              <Link
                to="/"
                className="transition hover:text-teal-600"
              >
                Home
              </Link>


              <Link
                to="/stores"
                className="transition hover:text-teal-600"
              >
                Stores
              </Link>


              {/* Customer-only links */}

              {isCustomer && (
                <>
                  <Link
                    to="/my-orders"
                    className="transition hover:text-teal-600"
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/cart"
                    className="transition hover:text-teal-600"
                  >
                    Cart
                  </Link>
                </>
              )}

            </div>

          </div>


          <div className="mt-6 border-t border-white/70 pt-5 text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} MarketHub. All rights reserved.
          </div>

        </footer>

      </main>

    </div>
  );
};


/* =============================================================
   GUEST HEADER
   Used when nobody is logged in
============================================================= */

const GuestHeader = () => {
  return (
    <header className="relative z-50 mb-8">

      <nav className="mx-auto max-w-7xl rounded-3xl border border-white/80 bg-white/75 px-4 py-3 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            className="group flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-lg font-bold text-white shadow-md shadow-teal-200/60 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              M
            </div>


            <div className="hidden sm:block">

              <p className="text-lg font-bold tracking-tight text-slate-900">
                Market<span className="text-teal-600">Hub</span>
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Your Marketplace
              </p>

            </div>

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:from-teal-100 hover:to-cyan-100"
            >
              Home
            </Link>


            <Link
              to="/stores"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              Stores
            </Link>

          </div>


          {/* =================================================
              AUTH ACTIONS
          ================================================== */}

          <div className="hidden items-center gap-3 md:flex">

            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-200/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-200/70"
            >
              Create Account
            </Link>

          </div>


          {/* =================================================
              MOBILE AUTH
          ================================================== */}

          <div className="flex items-center gap-2 md:hidden">

            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm"
            >
              Register
            </Link>

          </div>

        </div>

      </nav>

    </header>
  );
};


/* =============================================================
   STORE CARD
============================================================= */

const StoreCard = ({ store }) => {

  const storeName =
    store.name || "MarketHub Store";


  const storeDescription =
    store.description ||
    "Explore products from this independent store.";


  const storeImage =
    store.image ||
    store.logo ||
    store.storeImage ||
    null;


  return (
    <Link
      to={`/stores/${store.slug}`}
      className="group overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70"
    >

      {/* Image */}

      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-50">

        {storeImage ? (

          <img
            src={storeImage}
            alt={storeName}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />

        ) : (

          <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl text-white backdrop-blur-md">
              🏪
            </div>

          </div>

        )}


        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10" />


        <div className="absolute left-4 top-4">

          <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 shadow-sm backdrop-blur-md">
            Store
          </span>

        </div>

      </div>


      {/* Information */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate text-lg font-black text-slate-900 transition group-hover:text-teal-700">
              {storeName}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {storeDescription}
            </p>

          </div>


          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 transition group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:text-white">
            →
          </span>

        </div>


        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <span className="text-xs font-semibold text-slate-400">
            Explore store
          </span>

          <span className="text-xs font-bold text-teal-600">
            View products
          </span>

        </div>

      </div>

    </Link>
  );
};


/* =============================================================
   STORE SKELETON
============================================================= */

const StoreSkeleton = () => {

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

      {[1, 2, 3].map((item) => (

        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-slate-200/30"
        >

          <div className="h-44 animate-pulse bg-gradient-to-br from-slate-200 via-cyan-100 to-teal-100" />

          <div className="space-y-3 p-5">

            <div className="h-5 w-2/3 animate-pulse rounded-lg bg-slate-200" />

            <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />

            <div className="h-4 w-4/5 animate-pulse rounded-lg bg-slate-100" />

          </div>

        </div>

      ))}

    </div>
  );
};


/* =============================================================
   EMPTY STORES
============================================================= */

const EmptyStores = () => {

  return (
    <div className="rounded-3xl border border-white/80 bg-white/75 px-6 py-14 text-center shadow-lg shadow-slate-200/30 backdrop-blur-xl flex flex-col justify-center items-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 text-2xl">
        🏪
      </div>


      <h3 className="mt-5 text-xl font-bold text-slate-900">
        Stores are coming soon
      </h3>


      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        New stores will appear here as vendors create their storefronts on
        MarketHub.
      </p>

    </div>
  );
};


/* =============================================================
   JOURNEY CARD
============================================================= */

const JourneyCard = ({
  number,
  icon,
  title,
  description,
}) => {

  return (
    <div className="relative rounded-3xl border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-200/30 backdrop-blur-xl flex flex-col justify-center items-center">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 text-xl">
          {icon}
        </div>


        <span className="text-xs font-black tracking-widest text-slate-300">
          {number}
        </span>

      </div>


      <h3 className="mt-5 text-base font-bold text-slate-900">
        {title}
      </h3>


      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
};


export default HomePage;