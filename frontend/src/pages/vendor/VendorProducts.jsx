import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const VendorProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Keeps track of which image is active for each product
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

  // Move to next image
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

  // Move to previous image
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
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium tracking-wide text-teal-600">
              STORE MANAGEMENT
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              My Products
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage your products, inventory, pricing and
              product images from one place.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/vendor/products/new")
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-teal-700 hover:shadow-md sm:w-auto"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Product
          </button>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-3xl border border-gray-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {products.length}
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <p className="text-sm font-medium text-gray-500">
                Products With Images
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {
                  products.filter(
                    (product) =>
                      product.images &&
                      product.images.length > 0
                  ).length
                }
              </p>
            </div>

            <div className="rounded-3xl border border-teal-100 bg-teal-50/60 p-5 shadow-[0_8px_30px_rgba(13,148,136,0.06)] backdrop-blur-xl">
              <p className="text-sm font-medium text-teal-700">
                Inventory Items
              </p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {products.reduce(
                  (total, product) =>
                    total + (Number(product.stock) || 0),
                  0
                )}
              </p>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-60 animate-pulse bg-gray-100" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white/70 px-6 py-16 text-center shadow-[0_15px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl sm:px-10">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-100/50 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-2xl text-teal-600">
                +
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No products yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Start building your store by adding your
                first product. You can add product images,
                pricing, stock and variants.
              </p>

              <button
                onClick={() =>
                  navigate("/vendor/products/new")
                }
                className="mt-6 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Add Your First Product
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

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
                  className="group overflow-hidden rounded-3xl border border-gray-200/80 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)]"
                >

                  {/* Image Carousel */}
                  <div className="relative h-60 overflow-hidden bg-gray-100">

                    {hasImages ? (
                      <>
                        <img
                          src={currentImage}
                          alt={`${product.name} ${
                            currentImageIndex + 1
                          }`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        {/* Image counter */}
                        {product.images.length > 1 && (
                          <div className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                            {currentImageIndex + 1} /{" "}
                            {product.images.length}
                          </div>
                        )}

                        {/* Previous button */}
                        {product.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePreviousImage(
                                product._id,
                                product.images.length
                              )
                            }
                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-lg text-white opacity-100 backdrop-blur-md transition hover:bg-black/60"
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                        )}

                        {/* Next button */}
                        {product.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleNextImage(
                                product._id,
                                product.images.length
                              )
                            }
                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-lg text-white opacity-100 backdrop-blur-md transition hover:bg-black/60"
                            aria-label="Next image"
                          >
                            ›
                          </button>
                        )}

                        {/* Image dots */}
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
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-xl text-gray-400 shadow-sm">
                            ◇
                          </div>

                          <p className="mt-3 text-xs font-medium text-gray-400">
                            No image
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stock badge */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                          product.stock > 0
                            ? "border-white/50 bg-white/85 text-gray-800"
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
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        {product.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 text-lg font-semibold text-gray-900">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Variants */}
                    {product.variants &&
                      product.variants.length > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">
                            Variants
                          </span>

                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
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
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        disabled={isDeleting}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>
    </div>
  );
};

export default VendorProducts;

