import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";
import AdminHeader from "./AdminHeader";

import {
  ArrowLeftIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";


const AdminProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchProduct();
  }, [id]);


  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/products/${id}`
      );

      setProduct(
        response.data?.product || null
      );

    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product."
      );

    } finally {
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />

      </div>
    );
  }


  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-10">

        <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/80 bg-white/75 p-8 text-center shadow-xl backdrop-blur-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

            <XCircleIcon className="h-7 w-7 text-red-500" />

          </div>


          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Product Not Found
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "This product could not be found."}
          </p>


          <Link
            to="/admin/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Products
          </Link>

        </div>

      </div>
    );
  }


  const stock =
    Number(product.stock) || 0;


  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 font-sans text-slate-900">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-300/10 blur-3xl" />

      </div>

      <AdminHeader/>
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK */}

        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-teal-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Products
        </Link>


        {/* PRODUCT HEADER */}

        <section className="mt-7 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl sm:p-8">

          <div className="flex flex-col gap-7 md:flex-row">

            {/* IMAGE */}

            <div className="h-64 w-full shrink-0 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-100 md:h-64 md:w-64">

              {product.images?.[0] ? (

                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full w-full items-center justify-center">

                  <CubeIcon className="h-16 w-16 text-slate-300" />

                </div>

              )}

            </div>


            {/* INFORMATION */}

            <div className="min-w-0 flex-1">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Product Details
              </p>


              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {product.name}
              </h1>


              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                {product.description ||
                  "No product description has been added."}
              </p>


              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">

                <Stat
                  icon={CurrencyRupeeIcon}
                  label="Price"
                  value={`₹${Number(
                    product.price || 0
                  ).toLocaleString("en-IN")}`}
                />


                <Stat
                  icon={ArchiveBoxIcon}
                  label="Stock"
                  value={
                    stock === 0
                      ? "Out of stock"
                      : `${stock} units`
                  }
                />


                <Stat
                  icon={CubeIcon}
                  label="Variants"
                  value={
                    product.variants
                      ?.length || 0
                  }
                />

              </div>

            </div>

          </div>

        </section>


        {/* STORE + VENDOR */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* STORE */}

          <section className="rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
              Store
            </p>


            <div className="mt-6 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600">

                <BuildingStorefrontIcon className="h-7 w-7 text-white" />

              </div>


              <div className="min-w-0">

                <h2 className="truncate text-xl font-black text-slate-900">
                  {product.store?.name ||
                    "Unknown Store"}
                </h2>


                <p className="mt-1 text-sm text-slate-500">
                  /{product.store?.slug ||
                    "—"}
                </p>

              </div>

            </div>

            {product.store?.description && (
              <p className="mt-5 text-sm leading-7 text-slate-600">
                {
                  product.store.description
                }
              </p>
            )}

          </section>


          {/* VENDOR */}

          <section className="rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
              Vendor
            </p>


            {product.vendor ? (

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-lg font-black text-white">

                  {product.vendor.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "V"}

                </div>


                <div className="min-w-0">

                  <h2 className="truncate text-xl font-black text-slate-900">
                    {product.vendor.name}
                  </h2>


                  <div className="mt-1 flex items-center gap-2">

                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />

                    <span className="truncate text-sm text-slate-500">
                      {product.vendor.email}
                    </span>

                  </div>

                </div>

              </div>

            ) : (

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-red-600">

                <XCircleIcon className="h-5 w-5" />

                Vendor unavailable

              </div>

            )}

          </section>

        </div>


        {/* VARIANTS */}

        <section className="mt-6 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl sm:p-8">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                Product Configuration
              </p>


              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Variants
              </h2>

            </div>


            <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
              {product.variants?.length ||
                0}{" "}
              total
            </div>

          </div>


          {product.variants?.length > 0 ? (

            <div className="mt-6 grid gap-3 md:grid-cols-2">

              {product.variants.map(
                (variant) => (

                  <div
                    key={variant._id}
                    className="rounded-2xl border border-slate-100 bg-white/60 p-5"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3 className="font-black text-slate-900">
                          {variant.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-teal-600">
                          ₹
                          {Number(
                            variant.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>


                      <div
                        className={`rounded-xl px-3 py-2 text-xs font-bold ${
                          Number(
                            variant.stock
                          ) === 0
                            ? "bg-red-50 text-red-600"
                            : Number(
                                variant.stock
                              ) <= 5
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {variant.stock}{" "}
                        in stock
                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/40 p-8 text-center">

              <p className="text-sm font-medium text-slate-500">
                This product does not have any
                variants.
              </p>

            </div>

          )}

        </section>


        {/* METADATA */}

        <section className="mt-6 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur-xl">

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="flex items-center gap-3">

              <CalendarDaysIcon className="h-5 w-5 text-slate-400" />

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {formatDate(
                    product.createdAt
                  )}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3">

              <CalendarDaysIcon className="h-5 w-5 text-slate-400" />

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Last Updated
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {formatDate(
                    product.updatedAt
                  )}
                </p>

              </div>

            </div>

          </div>

        </section>


        <footer className="py-9 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            MarketHub Platform Administration
          </p>

        </footer>

      </main>

    </div>
  );
};


// ==========================================
// STAT
// ==========================================

const Stat = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-4">

      <Icon className="h-5 w-5 text-teal-600" />

      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">
        {value}
      </p>

    </div>
  );
};


export default AdminProductDetails;