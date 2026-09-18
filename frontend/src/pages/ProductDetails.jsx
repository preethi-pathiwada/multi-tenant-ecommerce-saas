import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../services/api";
import { addToCart } from "../redux/cartSlice";
import CustomerHeader from "./customer/CustomerHeader";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Active product image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);

        setProduct(response.data.product);

        // Always start with the first image
        setActiveImageIndex(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Please select the size to continue");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        variantId: selectedVariant?._id || null,
        name: product.name,
        variantName: selectedVariant?.name || null,
        price: selectedVariant?.price || product.price,
        store: product.store,
      })
    );
  };

  // =========================================================
  // IMAGE CAROUSEL
  // =========================================================

  const images = Array.isArray(product?.images)
    ? product.images
    : [];

  const nextImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-6 sm:px-6 lg:px-8">
        <CustomerHeader />

        <main className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
            <div className="grid animate-pulse gap-8 md:grid-cols-2">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-200 via-cyan-100 to-teal-100" />

              <div className="flex flex-col justify-center space-y-5 p-2">
                <div className="h-4 w-24 rounded-full bg-slate-200" />
                <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
                <div className="h-8 w-32 rounded-xl bg-cyan-100" />
                <div className="h-20 w-full rounded-xl bg-slate-100" />
                <div className="h-12 w-full rounded-2xl bg-slate-200" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-6 sm:px-6 lg:px-8">
        <CustomerHeader />

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl text-white shadow-lg shadow-teal-200">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This product may have been removed or is no longer available.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;

  const currentStock =
    selectedVariant !== null ? selectedVariant.stock : product.stock;

  const isOutOfStock = currentStock <= 0;

  const currentImage =
    images.length > 0 ? images[activeImageIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-6 sm:px-6 lg:px-8">
      <CustomerHeader />

      <main className="mx-auto max-w-6xl pb-12">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="font-medium text-slate-500 transition hover:text-teal-600"
          >
            Home
          </Link>

          <span className="text-slate-300">/</span>

          <span className="truncate font-semibold text-slate-700">
            {product.name}
          </span>
        </div>

        {/* Product Card */}
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

            {/* =================================================
                PRODUCT IMAGE + CAROUSEL
            ================================================== */}

            <div>
              <div className="group relative aspect-square overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-50">

                {currentImage ? (
                  <img
                    key={currentImage}
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-7xl">
                    🛍️
                  </div>
                )}

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-white/10" />

                {/* =================================================
                    PREVIOUS IMAGE BUTTON
                ================================================== */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-slate-900/35 text-xl font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900/55 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                )}

                {/* =================================================
                    NEXT IMAGE BUTTON
                ================================================== */}

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-slate-900/35 text-xl font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition duration-300 hover:bg-slate-900/55 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    →
                  </button>
                )}

                {/* Product badge */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-xs font-bold text-teal-700 shadow-sm backdrop-blur-md">
                    MarketHub Product
                  </span>
                </div>

                {/* Stock badge */}
                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                      isOutOfStock
                        ? "border-red-200 bg-red-50/90 text-red-700"
                        : currentStock <= 5
                        ? "border-amber-200 bg-amber-50/90 text-amber-700"
                        : "border-emerald-200 bg-emerald-50/90 text-emerald-700"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : currentStock <= 5
                      ? `Only ${currentStock} left`
                      : "In Stock"}
                  </span>
                </div>

                {/* =================================================
                    IMAGE POSITION
                ================================================== */}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/40 bg-slate-900/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* =================================================
                  IMAGE THUMBNAILS
              ================================================== */}

              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, index) => {
                    const isActive = activeImageIndex === index;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectImage(index)}
                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition duration-200 ${
                          isActive
                            ? "border-teal-500 shadow-md shadow-teal-200/60"
                            : "border-slate-200 hover:border-cyan-300"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className={`h-full w-full object-cover transition duration-300 ${
                            isActive
                              ? "scale-105"
                              : "hover:scale-105"
                          }`}
                        />

                        {/* Active thumbnail overlay */}
                        {isActive && (
                          <div className="absolute inset-0 border-2 border-white/30" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Single image indicator */}
              {images.length === 1 && (
                <div className="mt-3 text-center text-xs font-medium text-slate-400">
                  1 image
                </div>
              )}
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================== */}

            <div className="flex flex-col justify-center">

              {/* Small label */}
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Product Details
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3">
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                  ₹{currentPrice?.toLocaleString("en-IN")}
                </span>

                {selectedVariant && (
                  <span className="mb-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    {selectedVariant.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-cyan-50/40 to-teal-50/40 p-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {product.description || "No description available."}
                </p>
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Available Options
                    </h2>

                    {selectedVariant && (
                      <span className="text-xs font-semibold text-teal-600">
                        Selected: {selectedVariant.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {product.variants.map((variant) => {
                      const variantOutOfStock = variant.stock <= 0;

                      const isSelected =
                        selectedVariant?._id === variant._id;

                      return (
                        <button
                          key={variant._id}
                          type="button"
                          disabled={variantOutOfStock}
                          onClick={() => setSelectedVariant(variant)}
                          className={`relative rounded-2xl border p-4 text-left transition duration-200 ${
                            isSelected
                              ? "border-teal-400 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 shadow-md shadow-teal-100"
                              : variantOutOfStock
                              ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50/40"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-[10px] font-bold text-white">
                              ✓
                            </span>
                          )}

                          <p className="pr-6 text-sm font-bold text-slate-800">
                            {variant.name}
                          </p>

                          <p className="mt-1 text-lg font-bold text-violet-700">
                            ₹{variant.price?.toLocaleString("en-IN")}
                          </p>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              variantOutOfStock
                                ? "text-red-500"
                                : variant.stock <= 5
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {variantOutOfStock
                              ? "Out of stock"
                              : `${variant.stock} available`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <span className="text-sm font-medium text-slate-500">
                  {selectedVariant
                    ? "Selected option stock"
                    : "Available stock"}
                </span>

                <span
                  className={`text-sm font-bold ${
                    isOutOfStock
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Unavailable"
                    : `${currentStock} units`}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-slate-300 shadow-none"
                      : "bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 shadow-cyan-200/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/70 active:translate-y-0"
                  }`}
                >
                  <span className="text-lg">🛒</span>

                  {isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>

                <Link
                  to="/cart"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 px-6 py-3.5 text-sm font-bold text-violet-700 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-100"
                >
                  <span className="text-lg">🛍️</span>
                  Go to Cart
                </Link>
              </div>

              {/* Trust information */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5">
                <div className="text-center">
                  <div className="text-lg">🔒</div>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Secure Checkout
                  </p>
                </div>

                <div className="border-x border-slate-100 text-center">
                  <div className="text-lg">⚡</div>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Fast Ordering
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-lg">✓</div>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Verified Store
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:px-6">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-teal-600"
          >
            ← Continue Shopping
          </Link>

          <Link
            to="/cart"
            className="text-sm font-bold text-teal-600 transition hover:text-cyan-600"
          >
            View Cart →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;