import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // FETCH PRODUCT

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const product = response.data.product;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
        });

        setExistingImages(product.images || []);

        setVariants(
          (product.variants || []).map((variant) => ({
            name: variant.name || "",
            price: variant.price ?? "",
            stock: variant.stock ?? "",
          }))
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // BASIC FORM

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // NEW IMAGE HANDLING

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const totalImages =
      existingImages.length +
      newImages.length +
      selectedFiles.length;

    if (totalImages > 5) {
      setError("A product can have a maximum of 5 images.");
      return;
    }

    const imageObjects = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((current) => [
      ...current,
      ...imageObjects,
    ]);

    setError("");

    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const removeNewImage = (index) => {
    setNewImages((current) => {
      const image = current[index];

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter(
        (_, imageIndex) => imageIndex !== index
      );
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

    if (
      existingImages.length + newImages.length > 5
    ) {
      setError("A product can have a maximum of 5 images.");
      return;
    }

    for (const variant of variants) {
      if (!variant.name.trim()) {
        setError("Every variant must have a name.");
        return;
      }

      if (
        variant.price === "" ||
        Number(variant.price) < 0
      ) {
        setError("Every variant must have a valid price.");
        return;
      }

      if (
        variant.stock === "" ||
        Number(variant.stock) < 0
      ) {
        setError(
          "Every variant must have a valid stock quantity."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", form.name.trim());
      data.append(
        "description",
        form.description.trim()
      );
      data.append("price", Number(form.price));
      data.append("stock", Number(form.stock));

      if (newImages.length === 0) {
        data.append(
          "images",
          JSON.stringify(existingImages)
        );
      } else {
        newImages.forEach((image) => {
          data.append("images", image.file);
        });
      }

      const formattedVariants = variants.map(
        (variant) => ({
          name: variant.name.trim(),
          price: Number(variant.price),
          stock: Number(variant.stock),
        })
      );

      data.append(
        "variants",
        JSON.stringify(formattedVariants)
      );

      await api.put(`/products/${id}`, data);

      alert("Product updated successfully");

      navigate("/vendor/products");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING

  if (loading) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
            <div className="h-4 w-32 animate-pulse rounded-full bg-teal-100" />
            <div className="mt-4 h-10 w-52 animate-pulse rounded-xl bg-slate-200" />

            <div className="mt-8 space-y-5">
              <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/vendor/products")}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-white/70 px-4 py-2 text-sm font-bold text-teal-700 shadow-sm backdrop-blur-xl transition hover:-translate-x-0.5 hover:border-teal-300 hover:bg-white"
          >
            ← Back to Products
          </button>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            Vendor Dashboard
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Edit Product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Update your product information, images,
            inventory and variants.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-4 text-sm font-medium text-red-600 shadow-sm backdrop-blur-xl">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
              !
            </span>
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* PRODUCT INFORMATION */}
          <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-teal-300/10 blur-3xl" />

            <div className="relative mb-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Product Details
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Product Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update the basic details of your product.
              </p>
            </div>

            <div className="relative space-y-5">

              <div>
                <label className="mb-2.5 block text-sm font-bold text-slate-700">
                  Product Name
                </label>

                <input
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                  required
                />
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-bold text-slate-700">
                  Product Description
                </label>

                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full resize-none rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2.5 block text-sm font-bold text-slate-700">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-teal-600">
                      ₹
                    </span>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 py-3.5 pl-9 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-bold text-slate-700">
                    Stock
                  </label>

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                    required
                  />
                </div>

              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative mb-7 flex items-center justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                    Visuals
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Product Images
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Manage your product images.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-teal-200/70 bg-teal-50/80 px-3 py-1.5 text-xs font-bold text-teal-700">
                {existingImages.length + newImages.length}/5
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
              {existingImages.length +
                newImages.length <
                5 && (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="group flex aspect-square flex-col items-center justify-center rounded-3xl border-2 border-dashed border-teal-200/80 bg-gradient-to-br from-teal-50/70 to-cyan-50/40 p-4 transition duration-300 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg hover:shadow-teal-100/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl font-light text-white shadow-md shadow-teal-200/60 transition group-hover:scale-105">
                    +
                  </div>

                  <span className="mt-3 text-xs font-bold text-slate-700">
                    Add Image
                  </span>

                  <span className="mt-1 text-[11px] font-medium text-slate-400">
                    JPG / PNG
                  </span>
                </button>
              )}

              {/* EXISTING IMAGES */}
              {existingImages.map(
                (image, index) => (
                  <div
                    key={image}
                    className="group relative aspect-square overflow-hidden rounded-3xl border border-white/80 bg-slate-100 shadow-md"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {index === 0 && (
                      <span className="absolute left-2.5 top-2.5 rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-teal-700 shadow-sm backdrop-blur">
                        Main Image
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(index)
                      }
                      className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {/* NEW IMAGES */}
              {newImages.map(
                (image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-3xl border border-teal-200 bg-slate-100 shadow-md"
                  >
                    <img
                      src={image.preview}
                      alt={`New product ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                      New
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 text-lg text-white shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>
                )
              )}

            </div>

            <p className="mt-4 text-xs font-medium leading-5 text-slate-400">
              You can keep your existing images or replace them
              with newly uploaded images. Maximum 5 images.
            </p>
          </section>

          {/* VARIANTS */}
          <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    Options
                  </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Product Variants
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Update sizes, colors or other variations.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-cyan-200/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-200/70"
              >
                + Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="relative mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-9 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-slate-300 shadow-sm">
                  +
                </div>

                <p className="mt-3 text-sm font-bold text-slate-600">
                  No variants added
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  Variants are optional.
                </p>
              </div>
            ) : (
              <div className="relative mt-6 space-y-4">

                {variants.map(
                  (variant, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/90 bg-gradient-to-br from-white/90 to-slate-50/60 p-4 shadow-sm sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          Variant {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeVariant(index)
                          }
                          className="text-xs font-bold text-red-500 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
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
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                          />
                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/vendor/products")
              }
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Update Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;