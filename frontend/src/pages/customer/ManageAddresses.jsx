import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../../services/api";
import CustomerHeader from "./CustomerHeader";

const emptyForm = {label: "HOME", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false};

const ManageAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const fromCheckout = location.state?.from === "checkout";

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/addresses");

      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Fetch addresses error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);

    setForm({...emptyForm, isDefault: addresses.length === 0});

    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address._id);

    setForm({
      label: address.label || "HOME",
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      isDefault: address.isDefault || false,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill in all address fields.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
      } else {
        await api.post("/addresses", form);
      }

      await fetchAddresses();

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      console.error("Save address error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/addresses/${id}`);

      await fetchAddresses();
    } catch (error) {
      console.error("Delete address error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete address."
      );
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/addresses/${id}/default`);

      await fetchAddresses();
    } catch (error) {
      console.error("Set default address error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update default address."
      );
    }
  };

  const getLabelIcon = (label) => {
    if (label === "HOME") return "⌂";
    if (label === "WORK") return "▣";
    return "◆";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">
      <CustomerHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* Page Header */}
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-6 text-white shadow-xl shadow-cyan-200/40 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                Delivery preferences
              </p>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Manage Addresses
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
                Save your frequently used delivery addresses and check
                out faster next time.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-teal-700 shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-cyan-50"
            >
              + Add New Address
            </button>

          </div>
        </section>

        {/* Back to Checkout */}
        <div className="mb-6">
            {fromCheckout ? (
                <button type="button" onClick={() => navigate("/checkout")} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-teal-700">
                ← Back to Checkout
                </button>
            ) : (
                <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-teal-700">
                ← Back to Home
                </Link>
            )}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-xl shadow-slate-200/50 backdrop-blur-xl">

            <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    {editingId ? "Update address" : "New address"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {editingId ? "Edit Address" : "Add Address"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>

              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 sm:p-8"
            >

              {/* Address Label */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Address Type
                </label>

                <div className="grid grid-cols-3 gap-3">

                  {[
                    { value: "HOME", label: "Home", icon: "⌂" },
                    { value: "WORK", label: "Work", icon: "▣" },
                    { value: "OTHER", label: "Other", icon: "◆" },
                  ].map((item) => (
                    <button key={item.value} type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          label: item.value,
                        }))
                      }
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${
                        form.label === item.value
                          ? "border-teal-300 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-teal-200 hover:bg-teal-50/40"
                      }`}
                    >
                      <span className="mr-1.5">
                        {item.icon}
                      </span>

                      {item.label}
                    </button>
                  ))}

                </div>
              </div>

              {/* Name + Phone */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter recipient name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>

              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="House / Flat / Street / Area"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </div>

              {/* City / State / Pincode */}
              <div className="grid gap-5 sm:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  />
                </div>

              </div>

              {/* Default */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/70 to-cyan-50/70 p-4">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 accent-teal-600"
                />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Make this my default address
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    This address will be selected automatically during checkout.
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

              </div>
            </form>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-[2rem] bg-white/70"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && addresses.length === 0 && !showForm && (
          <section className="rounded-[2rem] border border-white/80 bg-white/80 px-6 py-16 text-center shadow-lg shadow-slate-200/40 backdrop-blur-xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 text-3xl text-teal-600">
              ⌂
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No saved addresses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your delivery address once and we'll make checkout
              much faster for your future orders.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200/50 transition hover:-translate-y-0.5"
            >
              + Add Your First Address
            </button>

          </section>
        )}

        {/* Address Cards */}
        {!loading && addresses.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">

            {addresses.map((item) => (
              <article
                key={item._id}
                className={`group relative overflow-hidden rounded-[2rem] border bg-white/90 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 ${
                  item.isDefault
                    ? "border-teal-200 shadow-teal-100/60"
                    : "border-white/80 shadow-slate-200/50"
                }`}
              >

                {/* Accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                    item.label === "HOME"
                      ? "from-teal-500 via-cyan-500 to-blue-500"
                      : item.label === "WORK"
                      ? "from-blue-500 via-indigo-500 to-violet-500"
                      : "from-violet-500 via-fuchsia-500 to-pink-500"
                  }`}
                />

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
                        item.isDefault
                          ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {getLabelIcon(item.label)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="font-bold text-slate-900">
                          {item.label}
                        </h2>

                        {item.isDefault && (
                          <span className="rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                            Default
                          </span>
                        )}

                      </div>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Delivery address
                      </p>
                    </div>

                  </div>

                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50/60 p-4">

                  <p className="font-bold text-slate-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.phone}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.address}
                    <br />
                    {item.city}, {item.state} - {item.pincode}
                  </p>

                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>

                  {!item.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(item._id)}
                      className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5"
                    >
                      Set as Default
                    </button>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default ManageAddresses;