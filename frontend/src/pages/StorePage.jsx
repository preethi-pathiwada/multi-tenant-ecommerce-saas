import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "../styles/globals.css";
import api from "../services/api";
import CustomerHeader from "./customer/CustomerHeader";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";

const StorePage = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * DETERMINE WHO IS VIEWING THE STORE
   * =========================================================
   *
   * Vendor:
   *   -> Do NOT show CustomerHeader
   *   -> Product cards are NOT clickable
   *
   * Customer:
   *   -> Show CustomerHeader
   *   -> Product cards are clickable
   *
   * Not logged in:
   *   -> Show CustomerHeader
   *   -> Product cards are clickable
   */

  const [isVendor, setIsVendor] = useState(
    user?.role === "VENDOR"
  );

  /*
   * =========================================================
   * IMAGE CAROUSEL STATE
   * =========================================================
   *
   * Stores the currently displayed image index for each
   * product.
   *
   * Example:
   *
   * {
   *   productId1: 0,
   *   productId2: 2
   * }
   */

  const [activeImages, setActiveImages] = useState({});

  useEffect(() => {
    const fetchStore = async () => {
      try {
        /*
         * =====================================================
         * CHECK CURRENT USER
         * =====================================================
         *
         * Redux can be empty after a page refresh.
         *
         * /auth/me uses the JWT cookie to identify the user.
         *
         * Vendor:
         *   -> isVendor = true
         *
         * Customer:
         *   -> isVendor = false
         *
         * Guest:
         *   -> /auth/me returns 401
         *   -> isVendor = false
         */

        try {
          const userResponse = await api.get("/auth/me");

          const currentUser = userResponse.data.user;

          if (currentUser) {
            dispatch(setUser(currentUser));

            setIsVendor(currentUser.role === "VENDOR");
          }
        } catch (authError) {
          /*
           * 401 simply means the visitor is not logged in.
           *
           * Public store pages are accessible to guests,
           * so this is not an actual page error.
           */

          if (authError.response?.status === 401) {
            setIsVendor(false);
          } else {
            console.error(
              "Failed to check current user:",
              authError
            );

            /*
             * If authentication check itself fails, treat
             * the visitor as a normal public visitor.
             */
            setIsVendor(false);
          }
        }

        /*
         * =====================================================
         * FETCH STORE
         * =====================================================
         */

        const storeResponse = await api.get(`/stores/${slug}`);

        const storeData = storeResponse.data.store;

        setStore(storeData);

        /*
         * =====================================================
         * FETCH PRODUCTS
         * =====================================================
         */

        const productResponse = await api.get(
          `/products/store/${storeData._id}`
        );

        const storeProducts =
          productResponse.data.products || [];

        setProducts(storeProducts);

        /*
         * Initialize every product's carousel at image 0.
         */
        const initialImages = {};

        storeProducts.forEach((product) => {
          initialImages[product._id] = 0;
        });

        setActiveImages(initialImages);
      } catch (error) {
        console.error("Failed to fetch store:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug, dispatch]);

  /*
   * =========================================================
   * IMAGE CAROUSEL FUNCTIONS
   * =========================================================
   */

  const nextImage = (productId, imageCount) => {
    setActiveImages((prev) => ({
      ...prev,
      [productId]:
        ((prev[productId] || 0) + 1) % imageCount,
    }));
  };

  const previousImage = (productId, imageCount) => {
    setActiveImages((prev) => ({
      ...prev,
      [productId]:
        ((prev[productId] || 0) - 1 + imageCount) %
        imageCount,
    }));
  };

  const selectImage = (productId, index) => {
    setActiveImages((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">

        {/* Show CustomerHeader only if NOT a vendor */}
        {!isVendor && (
          <div className="px-4 pt-5 sm:px-6 lg:px-8">
            <CustomerHeader />
          </div>
        )}

        <main
          className={`px-4 pb-10 sm:px-6 lg:px-8 ${
            isVendor ? "pt-6" : ""
          }`}
        >
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

        {/* Show CustomerHeader only if NOT a vendor */}
        {!isVendor && (
          <div className="px-4 pt-5 sm:px-6 lg:px-8">
            <CustomerHeader />
          </div>
        )}

        <div
          className={`flex min-h-[60vh] items-center justify-center px-4 ${
            isVendor ? "pt-8" : ""
          }`}
        >
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

  /* =========================================================
     PUBLIC STORE
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">

      {/* =====================================================
          CUSTOMER HEADER
          =====================================================

          Vendor:
            NO HEADER

          Customer:
            CUSTOMER HEADER

          Random visitor:
            CUSTOMER HEADER
      ====================================================== */}

      {!isVendor && (
        <div className="px-4 pt-5 sm:px-6 lg:px-8">
          <CustomerHeader />
        </div>
      )}

      <main
        className={`px-4 pb-12 sm:px-6 lg:px-8 ${
          isVendor ? "pt-6 sm:pt-8" : ""
        }`}
      >
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

              {/* Only customers/random visitors need this */}
              {!isVendor && (
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700"
                >
                  Explore Other Stores
                  <span>→</span>
                </Link>
              )}

            </div>
          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================== */

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {products.map((product) => {

                const images =
                  Array.isArray(product.images) &&
                  product.images.length > 0
                    ? product.images
                    : [];

                const image =
                  images.length > 0
                    ? images[activeImages[product._id] || 0]
                    : null;

                const isOutOfStock = product.stock <= 0;

                /*
                 * =================================================
                 * PRODUCT CARD CONTENT
                 * =================================================
                 *
                 * We keep the exact same card styling.
                 *
                 * The ONLY difference:
                 *
                 * Vendor:
                 *   normal <div>
                 *
                 * Customer / Guest:
                 *   <Link>
                 */

                const productCard = (
                  <div
                    key={product._id}
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

                      {/* =================================================
                          CAROUSEL CONTROLS
                      ================================================== */}

                      {images.length > 1 && (
                        <>
                          {/* Previous */}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              previousImage(
                                product._id,
                                images.length
                              );
                            }}
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-slate-900/35 text-lg text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900/55 group-hover:opacity-100"
                            aria-label="Previous image"
                          >
                            ←
                          </button>

                          {/* Next */}
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              nextImage(
                                product._id,
                                images.length
                              );
                            }}
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-slate-900/35 text-lg text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900/55 group-hover:opacity-100"
                            aria-label="Next image"
                          >
                            →
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/30 bg-slate-900/30 px-2.5 py-1.5 backdrop-blur-md">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();

                                  selectImage(
                                    product._id,
                                    index
                                  );
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  (activeImages[product._id] || 0) ===
                                  index
                                    ? "w-4 bg-white"
                                    : "w-1.5 bg-white/60"
                                }`}
                                aria-label={`View image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}

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
                          {isVendor ? "Preview" : "View"}
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

                  </div>
                );

                /*
                 * =================================================
                 * VENDOR
                 * =================================================
                 *
                 * Vendor gets a normal div.
                 *
                 * Therefore:
                 * - card cannot navigate
                 * - no ProductDetails page
                 * - carousel still works
                 */

                if (isVendor) {
                  return productCard;
                }

                /*
                 * =================================================
                 * CUSTOMER / GUEST
                 * =================================================
                 *
                 * Customer and unregistered visitors get
                 * the clickable ProductDetails link.
                 */

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="block"
                  >
                    {productCard}
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