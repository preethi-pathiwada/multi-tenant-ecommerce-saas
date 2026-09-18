import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

import {
  BuildingStorefrontIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const CreateStore = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Automatically create slug from store name
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));

      if (errors.slug) {
        setErrors((prev) => ({
          ...prev,
          slug: "",
        }));
      }
    }
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your store name.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Store name must be at least 2 characters.";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Please enter a store URL.";
    } else if (formData.slug.trim().length < 2) {
      newErrors.slug = "Store URL must be at least 2 characters.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug =
        "Use only lowercase letters, numbers, and hyphens.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // CREATE STORE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/stores", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        slug: formData.slug.trim().toLowerCase(),
      });

      console.log("Store created:", response.data);

      setSuccess("Your store has been created successfully.");

      // Give the success message a moment to appear
      setTimeout(() => {
        navigate("/vendor/dashboard");
      }, 800);
    } catch (error) {
      console.error("Create store error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your store. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT STYLES
  // =========================

  const inputBase =
    "w-full rounded-2xl border bg-white/80 px-4 py-3.5 text-sm text-slate-900 outline-none backdrop-blur-xl transition-all duration-200 placeholder:text-slate-400";

  const normalInput =
    "border-slate-300 hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

  const errorInput =
    "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#b2dfdb] text-slate-900">

      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="absolute right-[-120px] top-20 h-[420px] w-[420px] rounded-full bg-cyan-200/25 blur-3xl" />

        <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-violet-200/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%)]" />

      </div>

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="relative z-10 px-4 pt-4 sm:px-6 lg:px-8">

        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:px-5">

          <Link
            to="/"
            className="flex items-center gap-2.5"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">

              <BuildingStorefrontIcon className="h-5 w-5" />

            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              Orbi<span className="text-teal-600">Kart</span>
            </span>

          </Link>

          <div className="hidden text-sm font-medium text-slate-500 sm:block">
            Vendor Setup
          </div>

        </nav>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="w-full max-w-2xl">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 shadow-sm shadow-teal-200/40">

              <BuildingStorefrontIcon className="h-8 w-8" />

            </div>

            <div className="mb-2 inline-flex items-center rounded-full border border-teal-200/70 bg-white/60 px-3 py-1 text-xs font-bold tracking-wide text-teal-700 backdrop-blur-xl">
              ONE-TIME SETUP
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Create your store
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Set up your storefront and start building your business
              on MarketHub.
            </p>

          </div>

          {/* =========================
              CARD
          ========================= */}

          <div className="rounded-[2rem] border border-white/90 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3.5 text-sm text-red-600">

                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <span>{error}</span>

              </div>
            )}

            {/* =========================
                SUCCESS
            ========================= */}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/90 px-4 py-3.5 text-sm text-teal-700">

                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <span>{success}</span>

              </div>
            )}

            {/* =========================
                FORM
            ========================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =========================
                  STORE NAME
              ========================= */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Store name
                </label>

                <div className="relative">

                  <BuildingStorefrontIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-500" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Preethi Fashion Store"
                    autoComplete="organization"
                    maxLength={100}
                    className={`${inputBase} pl-12 ${
                      errors.name ? errorInput : normalInput
                    }`}
                  />

                </div>

                {errors.name && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* =========================
                  STORE URL / SLUG
              ========================= */}

              <div>

                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Store URL
                </label>

                <div className="relative">

                  <TagIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-500" />

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="your-store-name"
                    className={`${inputBase} pl-12 ${
                      errors.slug ? errorInput : normalInput
                    }`}
                  />

                </div>

                {formData.slug && !errors.slug ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Your storefront will be available at:
                    <span className="ml-1 font-semibold text-teal-600">
                      /store/{formData.slug}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">
                    Use lowercase letters, numbers, and hyphens.
                  </p>
                )}

                {errors.slug && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.slug}
                  </p>
                )}

              </div>

              {/* =========================
                  DESCRIPTION
              ========================= */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Store description
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.description.length}/300
                  </span>

                </div>

                <div className="relative">

                  <DocumentTextIcon className="absolute left-4 top-4 h-5 w-5 text-blue-500" />

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell customers a little about your store..."
                    maxLength={300}
                    rows={5}
                    className={`${inputBase} resize-none pl-12`}
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  A short description helps customers understand what
                  your store offers.
                </p>

              </div>

              {/* =========================
                  INFO
              ========================= */}

              <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 p-4">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">

                    <CheckCircleIcon className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-700">
                      You're almost ready
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      You can update your store name and description
                      later from your vendor dashboard.
                    </p>

                  </div>

                </div>

              </div>

              {/* =========================
                  CREATE BUTTON
              ========================= */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Creating your store...
                  </>
                ) : (
                  <>
                    Create my store

                    <ArrowRightIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}

              </button>

            </form>

            {/* =========================
                FOOTER
            ========================= */}

            <div className="mt-7 border-t border-slate-200/60 pt-5 text-center">

              <p className="text-xs leading-5 text-slate-400">
                Your store is linked to your vendor account and can
                only be managed by you.
              </p>

            </div>

          </div>

          {/* =========================
              BOTTOM TEXT
          ========================= */}

          <p className="mt-6 text-center text-xs text-slate-400">
            Market<span className="font-semibold text-teal-500">Hub</span>
            {" "}· Vendor Store Setup
          </p>

        </div>

      </main>

    </div>
  );
};

export default CreateStore;

