import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import VendorHeader from "./VendorHeader";

const VendorProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [activeImages, setActiveImages] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/my-store");

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/products/${id}`);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );

      setActiveImages((currentImages) => {
        const updatedImages = { ...currentImages };

        delete updatedImages[id];

        return updatedImages;
      });
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleNextImage = (productId, totalImages) => {
    setActiveImages((currentImages) => {
      const currentIndex = currentImages[productId] || 0;

      return {
        ...currentImages,
        [productId]:
          (currentIndex + 1) % totalImages,
      };
    });
  };

  const handlePreviousImage = (
    productId,
    totalImages
  ) => {
    setActiveImages((currentImages) => {
      const currentIndex = currentImages[productId] || 0;

      return {
        ...currentImages,
        [productId]:
          (currentIndex - 1 + totalImages) %
          totalImages,
      };
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 text-slate-900">
      <VendorHeader />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute -left-24 top-96 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
              Product Management
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              My Products
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Manage your products, inventory, pricing and
              product images from one place.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/vendor/products/new")
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80 sm:w-auto"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Product
          </button>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl transition group-hover:bg-teal-300/20" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                    Catalog
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {products.length}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Total Products
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200/50">
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

            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:bg-cyan-300/20" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">
                    Media
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {
                      products.filter(
                        (product) =>
                          product.images &&
                          product.images.length > 0
                      ).length
                    }
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Products With Images
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-200/50">
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
                      d="M3.75 6.75h16.5v10.5H3.75z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 14.25l2.25-2.25 2.25 2.25 2.25-3 2.25 3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/10 blur-2xl transition group-hover:bg-blue-300/20" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    Inventory
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {products.reduce(
                      (total, product) =>
                        total +
                        (Number(product.stock) || 0),
                      0
                    )}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Inventory Items
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200/50">
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
                      d="M4.5 7.5h15v12h-15z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 7.5V5.25A1.5 1.5 0 019.75 3.75h4.5a1.5 1.5 0 011.5 1.5V7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-lg shadow-slate-200/30 backdrop-blur-xl"
              >
                <div className="h-60 animate-pulse bg-slate-100" />

                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 px-6 py-16 text-center shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:px-10">

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-3xl font-light text-white shadow-lg shadow-teal-200/60">
                +
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                No products yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Start building your store by adding your
                first product. You can add product images,
                pricing, stock and variants.
              </p>

              <button
                onClick={() =>
                  navigate("/vendor/products/new")
                }
                className="mt-6 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {products.map((product) => {
              const hasImages =
                product.images &&
                product.images.length > 0;

              const isDeleting =
                deletingId === product._id;

              const currentImageIndex =
                activeImages[product._id] || 0;

              const currentImage =
                hasImages
                  ? product.images[currentImageIndex]
                  : null;

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/60"
                >

                  {/* Image Carousel */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">

                    {hasImages ? (
                      <>
                        <img
                          src={currentImage}
                          alt={`${product.name} ${
                            currentImageIndex + 1
                          }`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        {product.images.length > 1 && (
                          <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                            {currentImageIndex + 1} /{" "}
                            {product.images.length}
                          </div>
                        )}

                        {product.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePreviousImage(
                                product._id,
                                product.images.length
                              )
                            }
                            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/60"
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                        )}

                        {product.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleNextImage(
                                product._id,
                                product.images.length
                              )
                            }
                            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/60"
                            aria-label="Next image"
                          >
                            ›
                          </button>
                        )}

                        {product.images.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border border-white/30 bg-black/30 px-2.5 py-1.5 backdrop-blur-md">
                            {product.images.map(
                              (_, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() =>
                                    setActiveImages(
                                      (currentImages) => ({
                                        ...currentImages,
                                        [product._id]:
                                          index
                                      })
                                    )
                                  }
                                  className={`h-1.5 rounded-full transition-all ${
                                    index ===
                                    currentImageIndex
                                      ? "w-5 bg-white"
                                      : "w-1.5 bg-white/50"
                                  }`}
                                  aria-label={`View image ${
                                    index + 1
                                  }`}
                                />
                              )
                            )}
                          </div>
                        )}

                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50/50">
                        <div className="text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl text-slate-300 shadow-md">
                            ◇
                          </div>

                          <p className="mt-3 text-xs font-bold text-slate-400">
                            No image
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stock badge */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                          product.stock > 0
                            ? "border-white/60 bg-white/90 text-slate-800"
                            : "border-red-100 bg-red-50/90 text-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-black text-slate-950">
                          {product.name}
                        </h2>

                        {product.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-lg font-black text-slate-950">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Variants */}
                    {product.variants &&
                      product.variants.length > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Variants
                          </span>

                          <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            {product.variants.length}
                          </span>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">

                      <button
                        onClick={() =>
                          navigate(
                            `/vendor/products/edit/${product._id}`
                          )
                        }
                        className="flex-1 rounded-2xl border border-teal-200/70 bg-teal-50/60 px-4 py-2.5 text-sm font-bold text-teal-700 transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:shadow-md hover:shadow-teal-100/60"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        disabled={isDeleting}
                        className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-500 transition duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </main>
    </div>
  );
};

export default VendorProducts;