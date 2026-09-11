import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-gray-200" />
          <div className="mt-8 h-72 rounded-3xl border border-gray-200 bg-white" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Store not found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              We couldn't find your store.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-600">
              Vendor Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              My Store
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage your store information and access your storefront.
            </p>
          </div>

          <button
            onClick={() => navigate("/vendor/store/edit")}
            className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
          >
            Edit Store
          </button>
        </div>

        {/* Store Overview */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-xl">

          {/* Store Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-teal-50/80 to-white px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-bold text-white shadow-sm">
                {store.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold text-gray-900">
                  {store.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your online storefront
                </p>
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

            {/* Store Name */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Store Name
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {store.name}
              </p>
            </div>

            {/* Store Slug */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Store Slug
              </p>

              <p className="mt-2 break-all text-base font-medium text-teal-700">
                /{store.slug}
              </p>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-7 text-gray-600">
                {store.description || "No description has been added yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your store and products.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            {/* Products */}
            <button
              onClick={() => navigate("/vendor/products")}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
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

                <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-teal-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Manage Products
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Add, edit, delete and manage products in your store.
              </p>
            </button>

            {/* Public Store */}
            <button
              onClick={() => navigate(`/store/${store.slug}`)}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
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

                <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-teal-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                View Public Store
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                See how your store appears to customers.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStore;
