import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditStore = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores/my-store");

        const store = response.data.store;

        setForm({
          name: store.name || "",
          description: store.description || "",
        });
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to load store"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Store name is required");
      return;
    }

    try {
      setSaving(true);

      await api.put("/stores/my-store", {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      alert("Store updated successfully");

      navigate("/vendor/store");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update store"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-gray-200" />

          <div className="mt-8 h-96 rounded-3xl border border-gray-200 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-teal-600">
            Store Settings
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Edit Store
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Update your store information and keep your storefront
            details current.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl">

          {/* Card Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-teal-50/80 to-white px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white shadow-sm">
                {form.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Store Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Make changes to how your store is presented.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >

            {/* Store Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Store Name
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your store name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
                required
              />
            </div>

            {/* Description */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <span className="text-xs text-gray-400">
                  {form.description.length}/500
                </span>
              </div>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell customers about your store..."
                rows={6}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
              />

              <p className="mt-2 text-xs text-gray-400">
                A short description helps customers understand what
                your store offers.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/vendor/store")}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStore;
