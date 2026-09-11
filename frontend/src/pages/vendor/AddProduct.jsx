import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    const imageFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...imageFiles]);

    setError("");

    // Allows selecting the same image again
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => {
      const image = current[index];

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  // VARIANTS
 
  const addVariant = () => {
    setVariants((current) => [
      ...current,
      {
        name: "",
        price: "",
        stock: "",
      },
    ]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  const removeVariant = (index) => {
    setVariants((current) =>
      current.filter((_, variantIndex) => variantIndex !== index)
    );
  };

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.name.trim()) {
        setError("Every variant must have a name.");
        return;
      }

      if (variant.price === "" || Number(variant.price) < 0) {
        setError("Every variant must have a valid price.");
        return;
      }

      if (variant.stock === "" || Number(variant.stock) < 0) {
        setError("Every variant must have a valid stock quantity.");
        return;
      }
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name.trim());
      data.append("description", form.description.trim());
      data.append("price", Number(form.price));
      data.append("stock", Number(form.stock));

      // Add product images
      images.forEach((image) => {
        data.append("images", image.file);
      });

      // Convert variant values to numbers
      const formattedVariants = variants.map((variant) => ({
        name: variant.name.trim(),
        price: Number(variant.price),
        stock: Number(variant.stock),
      }));

      data.append(
        "variants",
        JSON.stringify(formattedVariants)
      );

      await api.post("/products", data);

      alert("Product created successfully");

      navigate("/vendor/products");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-white px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/vendor/products")}
            className="mb-4 text-sm font-medium text-teal-600 transition hover:text-teal-700"
          >
            ← Back to Products
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            Vendor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Add a product with images, pricing, inventory and variants.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PRODUCT INFORMATION */}
          <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Product Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the basic information for your product.
              </p>
            </div>

            <div className="space-y-5">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  name="name"
                  placeholder="e.g. Premium Cotton Shirt"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  required
                />
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    required
                  />
                </div>

              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 5 images.
                </p>
              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {images.length}/5
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

              {/* ADD IMAGE */}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/40 p-4 transition hover:border-teal-400 hover:bg-teal-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-teal-600 shadow-sm">
                    +
                  </div>

                  <span className="mt-3 text-xs font-semibold text-gray-700">
                    Add Image
                  </span>

                  <span className="mt-1 text-[11px] text-gray-400">
                    JPG / PNG
                  </span>
                </button>
              )}

              {/* PREVIEWS */}
              {images.map((image, index) => (
                <div
                  key={`${image.file.name}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                >
                  <img
                    src={image.preview}
                    alt={`Product preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {/* MAIN IMAGE */}
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-teal-700 shadow-sm backdrop-blur">
                      Main Image
                    </span>
                  )}

                  {/* REMOVE */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-lg text-white transition hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <p className="mt-4 text-xs text-gray-400">
                The first image will be used as the main product image.
              </p>
            )}
          </section>

          {/* VARIANTS */}
          <section className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Variants
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add sizes, colors or other product variations.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                + Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-8 text-center">
                <p className="text-sm font-medium text-gray-600">
                  No variants added
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Variants are optional.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
                  >

                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        Variant {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-xs font-semibold text-red-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                      {/* VARIANT NAME */}
                      <div>
                        <label className="mb-2 block text-xs font-medium text-gray-600">
                          Variant Name
                        </label>

                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Medium"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      {/* VARIANT PRICE */}
                      <div>
                        <label className="mb-2 block text-xs font-medium text-gray-600">
                          Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="₹ 0"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                      {/* VARIANT STOCK */}
                      <div>
                        <label className="mb-2 block text-xs font-medium text-gray-600">
                          Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              index,
                              "stock",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                        />
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => navigate("/vendor/products")}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
