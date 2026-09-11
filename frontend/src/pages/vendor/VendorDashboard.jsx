import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        console.log(response.data.products)
        setSlug(response.data.products[0].slug);
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
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-600">
              Vendor Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage your store, products and orders from one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/vendor/products/add")}
            className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
          >
            + Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Products */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Products
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {loading ? "—" : productCount}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Products in your store
                </p>
              </div>

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
            </div>
          </div>

          {/* Orders */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Orders
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  0
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Orders received
                </p>
              </div>

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
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Revenue
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  ₹0
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Total store revenue
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <span className="text-lg font-semibold">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Quick Actions */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the most important parts of your store.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* Manage Products */}
              <button
                onClick={() => navigate("/vendor/products")}
                className="group rounded-2xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-md"
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

                <h3 className="mt-5 font-semibold text-gray-900">
                  Manage Products
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Add, edit and manage your product catalog.
                </p>
              </button>

              {/* My Store */}
              <button
                onClick={() => navigate("/vendor/store")}
                className="group rounded-2xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-md"
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
                        d="M3 10.5L12 3l9 7.5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 9.75V21h13.5V9.75M9 21v-6h6v6"
                      />
                    </svg>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-teal-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  My Store
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  View and update your store information.
                </p>
              </button>

              {/* Orders */}
              <button
                onClick={() => navigate("/vendor/orders")}
                className="group rounded-2xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-md"
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
                        d="M6 3h12v18H6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7h6M9 11h6M9 15h4"
                      />
                    </svg>
                  </div>

                  <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-teal-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                  View Orders
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  View and manage customer orders.
                </p>
              </button>

              {/* Public Store */}
              <button
                onClick={() => navigate(`/store/${slug}`)}
                className="group rounded-2xl border border-gray-200 bg-gray-50/60 p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-md"
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

                <h3 className="mt-5 font-semibold text-gray-900">
                  View Storefront
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Preview your public customer-facing store.
                </p>
              </button>
            </div>
          </div>

          {/* Store Status */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Store Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your store at a glance.
            </p>

            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />

                <span className="text-sm font-semibold text-gray-900">
                  Store Active
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Your store is ready for customers. Add products and
                keep your catalog updated.
              </p>
            </div>

            <button
              onClick={() => navigate("/vendor/store")}
              className="mt-5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              Manage Store
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">
              Dashboard tip:
            </span>{" "}
            Keep your product information, pricing and stock levels
            updated so customers always see accurate information.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
