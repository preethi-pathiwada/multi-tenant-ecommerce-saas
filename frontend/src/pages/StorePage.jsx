import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "../styles/globals.css";
import api from "../services/api";
import CustomerHeader from "./customer/CustomerHeader";

const StorePage = () => {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeResponse = await api.get(`/stores/${slug}`);

        const storeData = storeResponse.data.store;

        setStore(storeData);

        const productResponse = await api.get(
          `/products/store/${storeData._id}`
        );

        setProducts(productResponse.data.products || []);
      } catch (error) {
        console.error("Failed to fetch store:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  /* =========================================================
     LOADING
  ========================================================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">
        <div className="px-4 pt-5 sm:px-6 lg:px-8">
          <CustomerHeader />
        </div>

        <main className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            <div className="h-56 animate-pulse rounded-3xl bg-white/80 shadow-sm" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-3xl bg-white/80"
                />
              ))}
            </div>

          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     STORE NOT FOUND
  ========================================================= */
  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">
        <div className="px-4 pt-5 sm:px-6 lg:px-8">
          <CustomerHeader />
        </div>

        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-50 to-rose-100 text-3xl">
              🏪
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Store not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The store you're looking for doesn't exist or may no longer be
              available.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700"
            >
              Back to Home
              <span>→</span>
            </Link>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <div className="px-4 pt-5 sm:px-6 lg:px-8">
        <CustomerHeader />
      </div>

      <main className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              STORE HERO
          ================================================== */}
          <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-6 py-10 text-white shadow-xl shadow-teal-100/60 sm:px-10">

            {/* Decorative circles */}
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 right-28 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -left-20 bottom-[-80px] h-48 w-48 rounded-full bg-white/5" />

            <div className="relative">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                {/* Store information */}
                <div className="flex items-center gap-5">

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/30 bg-white/15 text-3xl shadow-lg backdrop-blur-md">
                    🏪
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50">
                      Welcome to
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                      {store.name}
                    </h1>

                    {store.description && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50 sm:text-base">
                        {store.description}
                      </p>
                    )}
                  </div>

                </div>

                {/* Product count */}
                <div className="w-fit rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-center backdrop-blur-md">

                  <p className="text-2xl font-bold">
                    {products.length}
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-50">
                    Products
                  </p>

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
              PRODUCT SECTION HEADER
          ================================================== */}
          <div className="mb-6 mt-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                Explore Collection
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Products from {store.name}
              </h2>
            </div>

            {products.length > 0 && (
              <span className="w-fit rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-teal-50 px-4 py-1.5 text-xs font-bold text-cyan-700">
                {products.length}{" "}
                {products.length === 1 ? "Product" : "Products"}
              </span>
            )}

          </div>

          {/* =================================================
              EMPTY PRODUCTS
          ================================================== */}
          {products.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 text-3xl">
                🛍️
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No products available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                This store hasn't added any products yet. Check back later for
                new arrivals.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700"
              >
                Explore Other Stores
                <span>→</span>
              </Link>

            </div>
          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================== */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {products.map((product) => {

                const image =
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : null;

                const isOutOfStock = product.stock <= 0;

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50"
                  >

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-50">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">
                          🛍️
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                      {/* Stock badge */}
                      <div className="absolute right-3 top-3">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold backdrop-blur-md ${
                            isOutOfStock
                              ? "border-red-200/80 bg-red-50/90 text-red-600"
                              : product.stock <= 5
                              ? "border-amber-200/80 bg-amber-50/90 text-amber-700"
                              : "border-emerald-200/80 bg-emerald-50/90 text-emerald-700"
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : product.stock <= 5
                            ? `Only ${product.stock} left`
                            : "In Stock"}
                        </span>
                      </div>

                    </div>

                    {/* Product Information */}
                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-teal-700">
                          {product.name}
                        </h3>

                        <span className="shrink-0 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 px-2.5 py-1 text-[10px] font-bold text-teal-600">
                          View
                        </span>

                      </div>

                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-5 flex items-end justify-between">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Price
                          </p>

                          <p className="mt-0.5 text-xl font-bold text-violet-700">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-lg text-white shadow-md shadow-teal-200/60 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                          →
                        </div>

                      </div>

                    </div>

                    {/* Bottom accent */}
                    <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-70 transition duration-300 group-hover:opacity-100" />

                  </Link>
                );
              })}

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StorePage;