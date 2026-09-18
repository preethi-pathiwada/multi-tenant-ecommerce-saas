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
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-4 w-32 rounded-full bg-teal-100" />
          <div className="mt-4 h-10 w-48 rounded-xl bg-slate-200" />
          <div className="mt-3 h-5 w-80 max-w-full rounded-lg bg-slate-100" />

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
            <div className="h-14 w-14 rounded-2xl bg-slate-200" />

            <div className="mt-6 space-y-5">
              <div className="h-12 rounded-2xl bg-slate-100" />
              <div className="h-36 rounded-2xl bg-slate-100" />
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
        <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            Store Settings
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Edit Store
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Update your store information and keep your storefront
            details current.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-xl shadow-slate-200/40 backdrop-blur-xl">

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

          {/* Card Header */}
          <div className="relative border-b border-white/80 bg-gradient-to-r from-teal-50/80 via-cyan-50/40 to-white/60 px-6 py-7 sm:px-8">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-xl font-black text-white shadow-lg shadow-cyan-200/60">
                {form.name?.charAt(0)?.toUpperCase() || "S"}
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Store Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Make changes to how your store is presented.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative space-y-7 p-6 sm:p-8"
          >

            {/* Store Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2.5 block text-sm font-bold text-slate-700"
              >
                Store Name
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your store name"
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
                required
              />
            </div>

            {/* Description */}
            <div>
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-slate-700"
                >
                  Description
                </label>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400">
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
                className="w-full resize-none rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100/70"
              />

              <p className="mt-2 text-xs leading-5 text-slate-400">
                A short description helps customers understand what
                your store offers.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/vendor/store")}
                disabled={saving}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-bold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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