import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";


const AdminStoreDetails = () => {
  const { id } = useParams();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchStore();
  }, [id]);


  const fetchStore = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/stores/${id}`
      );

      setStore(response.data?.store || null);

    } catch (error) {
      console.error(
        "Failed to fetch store:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load store."
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


  if (error || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-10">

        <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/80 bg-white/75 p-8 text-center shadow-xl backdrop-blur-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">

            <XCircleIcon className="h-7 w-7 text-red-500" />

          </div>


          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Store Not Found
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            {error || "This store could not be found."}
          </p>


          <Link
            to="/admin/stores"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Stores
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 font-sans text-slate-900">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-300/10 blur-3xl" />

      </div>


      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK */}

        <Link
          to="/admin/stores"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-teal-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Stores
        </Link>


        {/* HEADER */}

        <section className="mt-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">

              <BuildingStorefrontIcon className="h-8 w-8 text-white" />

            </div>


            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Store Details
              </p>


              <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950">
                {store.name}
              </h1>


              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">

                <LinkIcon className="h-4 w-4" />

                /{store.slug}

              </div>

            </div>

          </div>

        </section>


        {/* STORE INFORMATION */}

        <section className="mt-8 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
            Store Information
          </p>


          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <InfoCard
              label="Store Name"
              value={store.name}
              icon={BuildingStorefrontIcon}
            />


            <InfoCard
              label="Store Slug"
              value={`/${store.slug}`}
              icon={LinkIcon}
            />


            <InfoCard
              label="Created"
              value={formatDate(store.createdAt)}
              icon={CalendarDaysIcon}
            />


            <InfoCard
              label="Last Updated"
              value={formatDate(store.updatedAt)}
              icon={CalendarDaysIcon}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="mt-6 rounded-2xl border border-slate-100 bg-white/60 p-5">

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Description
            </p>


            <p className="mt-3 text-sm leading-7 text-slate-600">
              {store.description ||
                "No store description has been added."}
            </p>

          </div>

        </section>


        {/* OWNER */}

        <section className="mt-6 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl sm:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
            Store Owner
          </p>


          {store.owner ? (

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-lg font-black text-white">

                {store.owner.name
                  ?.charAt(0)
                  ?.toUpperCase() || "V"}

              </div>


              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-black text-slate-900">
                    {store.owner.name}
                  </h2>


                  {store.owner
                    .isEmailVerified ? (

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">

                      <CheckCircleIcon className="h-3 w-3" />

                      Verified

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">

                      <XCircleIcon className="h-3 w-3" />

                      Unverified

                    </span>

                  )}

                </div>


                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                  <EnvelopeIcon className="h-4 w-4" />

                  {store.owner.email}

                </div>

              </div>


              <div
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                  store.owner.isActive === false
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >

                <span
                  className={`h-2 w-2 rounded-full ${
                    store.owner.isActive === false
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                />

                {store.owner.isActive === false
                  ? "Inactive"
                  : "Active"}

              </div>

            </div>

          ) : (

            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

              <p className="text-sm font-bold text-red-700">
                Store owner unavailable
              </p>

            </div>

          )}

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
// INFO CARD
// ==========================================

const InfoCard = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

          <Icon className="h-5 w-5 text-slate-500" />

        </div>


        <div className="min-w-0">

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>


          <p className="mt-1 truncate text-sm font-bold text-slate-800">
            {value || "—"}
          </p>

        </div>

      </div>

    </div>
  );
};


export default AdminStoreDetails;