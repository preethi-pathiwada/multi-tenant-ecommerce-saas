import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import VendorHeader from "./VendorHeader";

const MyStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores/my-store");

        setStore(response.data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
        <VendorHeader />

        <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />

            <div className="relative animate-pulse">
              <div className="h-4 w-32 rounded-full bg-teal-100" />
              <div className="mt-4 h-10 w-48 rounded-xl bg-slate-200" />
              <div className="mt-3 h-5 w-72 max-w-full rounded-lg bg-slate-100" />

              <div className="mt-8 h-72 rounded-3xl border border-white/80 bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
        <VendorHeader />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-20 -z-10 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl font-black text-white shadow-lg shadow-teal-200/60">
              !
            </div>

            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
              Store not found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find your store. Please check your store setup and
              try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
      <VendorHeader />

      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />
          <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute -left-24 top-96 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        {/* Header */}
        <section className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
                Store Management
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
                My Store
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Manage your store information and access your storefront.
              </p>
            </div>

            <button
              onClick={() => navigate("/vendor/store/edit")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-3.09.883.883-3.09a4.5 4.5 0 011.13-1.897l9.254-9.254z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 7.125L16.875 4.5"
                />
              </svg>

              Edit Store
            </button>
          </div>
        </section>

        {/* Store Overview */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

          {/* Store Header */}
          <div className="relative border-b border-white/80 bg-gradient-to-r from-teal-50/80 via-cyan-50/40 to-white/60 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-2xl font-black text-white shadow-lg shadow-cyan-200/60">
                {store.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Your Store
                </div>

                <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {store.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your online storefront
                </p>
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="relative grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            {/* Store Name */}
            <div className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-teal-50/50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200/80 hover:shadow-lg hover:shadow-teal-100/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                    Store Name
                  </p>

                  <p className="mt-3 text-base font-black text-slate-900">
                    {store.name}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200/50 transition duration-300 group-hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M6.75 3.75v16.5m10.5-16.5v16.5M3.75 17.25h16.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Store Slug */}
            <div className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-cyan-50/50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200/80 hover:shadow-lg hover:shadow-cyan-100/60">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">
                    Store Slug
                  </p>

                  <p className="mt-3 break-all text-base font-bold text-cyan-700">
                    /{store.slug}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-200/50 transition duration-300 group-hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-2.36 2.36a4.5 4.5 0 01-6.364-6.364l1.5-1.5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.81 15.312a4.5 4.5 0 01-1.242-7.244l2.36-2.36a4.5 4.5 0 016.364 6.364l-1.5 1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="group rounded-3xl border border-white/90 bg-gradient-to-br from-white/80 to-blue-50/40 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200/80 hover:shadow-lg hover:shadow-blue-100/60 sm:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Description
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {store.description ||
                      "No description has been added yet."}
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200/50 transition duration-300 group-hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.7"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h7.5M8.25 10.5h7.5M8.25 14.25h4.5M6.75 3.75h10.5a2.25 2.25 0 012.25 2.25v12a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V6a2.25 2.25 0 012.25-2.25z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <div className="mb-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Store Management
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage your store and products from here.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Products */}
            <button
              onClick={() => navigate("/vendor/products")}
              className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white/75 p-6 text-left shadow-lg shadow-slate-200/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-teal-200/80 hover:shadow-xl hover:shadow-teal-100/70"
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-teal-300/10 blur-3xl transition duration-300 group-hover:bg-teal-300/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
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

                  <span className="text-xl text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-teal-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  Manage Products
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add, edit, delete and manage products in your store.
                </p>
              </div>
            </button>

            {/* Public Store */}
            <button
              onClick={() => navigate(`/stores/${store.slug}`)}
              className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white/75 p-6 text-left shadow-lg shadow-slate-200/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/80 hover:shadow-xl hover:shadow-cyan-100/70"
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl transition duration-300 group-hover:bg-cyan-300/20" />

              <div className="relative">
                <div className="flex items-center justify-between">
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
                        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <span className="text-xl text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  View Public Store
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  See how your store appears to customers.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Store Status */}
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="relative flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200/50">
              <span className="text-sm font-black">✓</span>
            </div>

            <div>
              <p className="text-sm font-black text-slate-800">
                Store is active
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your storefront is available to customers. Keep your store
                information and product catalog updated for the best
                experience.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyStore;