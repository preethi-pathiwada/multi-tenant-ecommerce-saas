import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomerHeader from "../customer/CustomerHeader";
import api from "../../services/api";

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);

  const isCustomer = user?.role?.toUpperCase() === "CUSTOMER";

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/stores");

        const storeData =
          response.data?.stores ||
          response.data?.data ||
          response.data ||
          [];

        setStores(Array.isArray(storeData) ? storeData : []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load stores right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="px-4 pt-5 sm:px-6 lg:px-8">

        {isCustomer ? (
          <CustomerHeader />
        ) : (
          <GuestHeader />
        )}

      </div>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="relative overflow-hidden pb-12 pt-6">

          <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />


          <div className="relative max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">

              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

              MarketHub Stores

            </div>


            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">

              Explore stores.

              <span className="block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Discover something new.
              </span>

            </h1>


            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">

              Browse independent stores on MarketHub and discover products
              from businesses you can shop from in one marketplace.

            </p>

          </div>

        </section>


        {/* ===================================================
            STORE COUNT
        ==================================================== */}

        {!loading && !error && stores.length > 0 && (

          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-slate-800">
                {stores.length}{" "}
                {stores.length === 1 ? "store" : "stores"} available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Explore a store to view its products.
              </p>

            </div>

          </div>

        )}


        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && <StoreSkeleton />}


        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (

          <div className="rounded-3xl border border-red-100 bg-white/80 px-6 py-14 text-center shadow-lg shadow-slate-200/30 backdrop-blur-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              !
            </div>


            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Something went wrong
            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Try Again
            </button>

          </div>

        )}


        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!loading && !error && stores.length === 0 && (

          <div className="rounded-3xl border border-white/80 bg-white/75 px-6 py-16 text-center shadow-lg shadow-slate-200/30 backdrop-blur-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 text-3xl">
              🏪
            </div>


            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No stores yet
            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There aren't any stores available on MarketHub yet.
              Check back soon as vendors start creating their storefronts.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Back to Home
            </Link>

          </div>

        )}


        {/* ===================================================
            STORE GRID
        ==================================================== */}

        {!loading && !error && stores.length > 0 && (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {stores.map((store) => (
              <StoreCard
                key={store._id}
                store={store}
              />
            ))}

          </div>

        )}


        {/* ===================================================
            BOTTOM CTA
        ==================================================== */}

        {!loading && !error && stores.length > 0 && (

          <section className="mt-16">

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-10 shadow-xl sm:px-10">

              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />


              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
                    MarketHub
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    Find something you'll love.
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Explore a store and start discovering products.
                  </p>

                </div>


                <Link
                  to="/"
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  Back to Home
                </Link>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
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


  return (
    <Link
      to={`/stores/${store.slug}`}
      className="group overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-teal-100 hover:shadow-xl hover:shadow-cyan-100/70"
    >

      {/* Store visual */}

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">

        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/20 blur-3xl" />

        <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />


        <div className="relative flex h-full items-center justify-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/30 bg-white/15 text-4xl text-white shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-105">
            🏪
          </div>

        </div>


        <div className="absolute left-4 top-4">

          <span className="rounded-full border border-white/50 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            Store
          </span>

        </div>

      </div>


      {/* Store information */}

      <div className="p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h2 className="truncate text-xl font-black text-slate-900 transition group-hover:text-teal-700">
              {storeName}
            </h2>


            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {storeDescription}
            </p>

          </div>


          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 transition duration-300 group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:text-white">
            →
          </span>

        </div>


        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

          <span className="text-xs font-semibold text-slate-400">
            Browse store
          </span>

          <span className="text-xs font-bold text-teal-600">
            View products →
          </span>

        </div>

      </div>

    </Link>
  );
};


/* =============================================================
   SKELETON
============================================================= */

const StoreSkeleton = () => {

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

      {[1, 2, 3, 4, 5, 6].map((item) => (

        <div
          key={item}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-lg shadow-slate-200/30"
        >

          <div className="h-48 animate-pulse bg-gradient-to-br from-slate-200 via-cyan-100 to-teal-100" />


          <div className="space-y-4 p-6">

            <div className="h-6 w-2/3 animate-pulse rounded-lg bg-slate-200" />

            <div className="h-4 w-full animate-pulse rounded-lg bg-slate-100" />

            <div className="h-4 w-4/5 animate-pulse rounded-lg bg-slate-100" />

            <div className="border-t border-slate-100 pt-4">

              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />

            </div>

          </div>

        </div>

      ))}

    </div>
  );
};


/* =============================================================
   GUEST HEADER
============================================================= */

const GuestHeader = () => {

  return (
    <header className="relative z-50 mb-8">

      <nav className="mx-auto max-w-7xl rounded-3xl border border-white/80 bg-white/75 px-4 py-3 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">

          {/* Logo */}

          <Link
            to="/"
            className="group flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-lg font-bold text-white shadow-md shadow-teal-200/60 transition group-hover:-translate-y-0.5"
            >
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


          {/* Navigation */}

          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              Home
            </Link>


            <Link
              to="/stores"
              className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2.5 text-sm font-semibold text-teal-700"
            >
              Stores
            </Link>

          </div>


          {/* Authentication */}

          <div className="hidden items-center gap-3 md:flex">

            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Create Account
            </Link>

          </div>


          {/* Mobile */}

          <div className="flex items-center gap-2 md:hidden">

            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-slate-700"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white"
            >
              Register
            </Link>

          </div>

        </div>

      </nav>

    </header>
  );
};


export default AllStores;