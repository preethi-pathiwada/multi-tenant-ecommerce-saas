import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import AdminHeader from "./AdminHeader";

import {
  UsersIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/vendors");

      const vendorData =
        response.data?.vendors ||
        response.data?.data ||
        response.data ||
        [];

      setVendors(
        Array.isArray(vendorData) ? vendorData : []
      );
    } catch (error) {
      console.error("Failed to fetch vendors:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load vendor information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (vendorId) => {
    try {
      setActionLoading(vendorId);
      setError("");

      const response = await api.put(
        `/admin/vendors/${vendorId}/status`
      );

      const updatedVendor =
        response.data?.vendor;

      setVendors((currentVendors) =>
        currentVendors.map((vendor) =>
          vendor._id === vendorId
            ? {
                ...vendor,
                ...(updatedVendor || {
                  isActive: !vendor.isActive,
                }),
              }
            : vendor
        )
      );
    } catch (error) {
      console.error(
        "Failed to update vendor status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update vendor status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return vendors;
    }

    return vendors.filter((vendor) => {
      const name =
        vendor.name?.toLowerCase() || "";

      const email =
        vendor.email?.toLowerCase() || "";

      return (
        name.includes(query) ||
        email.includes(query)
      );
    });
  }, [vendors, search]);

  const totalVendors = vendors.length;

  const activeVendors = vendors.filter(
    (vendor) => vendor.isActive !== false
  ).length;

  const inactiveVendors = vendors.filter(
    (vendor) => vendor.isActive === false
  ).length;

  const verifiedVendors = vendors.filter(
    (vendor) => vendor.isEmailVerified
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 font-sans text-slate-900">

      {/* =========================================================
          BACKGROUND GLOW
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-300/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-300/10 blur-3xl" />

      </div>
      <AdminHeader/>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =======================================================
            HEADER
        ======================================================== */}

        <section className="mb-8">

          <Link
            to="/admin/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-teal-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                  Marketplace Management
                </p>

              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Admin Vendors
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Manage vendor accounts, monitor activity and
                control marketplace access.
              </p>

            </div>

            <Link
              to="/admin/dashboard"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white/75 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:text-teal-700"
            >
              Dashboard
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

          </div>

        </section>


        {/* =======================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold text-red-800">
                Something went wrong
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                {error}
              </p>

            </div>

            <button
              onClick={fetchVendors}
              className="rounded-xl border border-red-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-white"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =======================================================
            SUMMARY CARDS
        ======================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={UsersIcon}
            label="Total Vendors"
            value={totalVendors}
            iconStyle="from-teal-500 to-cyan-600"
          />

          <SummaryCard
            icon={CheckCircleIcon}
            label="Active Vendors"
            value={activeVendors}
            iconStyle="from-emerald-500 to-teal-600"
          />

          <SummaryCard
            icon={XCircleIcon}
            label="Inactive Vendors"
            value={inactiveVendors}
            iconStyle="from-red-500 to-rose-600"
          />

          <SummaryCard
            icon={ShieldCheckIcon}
            label="Verified Vendors"
            value={verifiedVendors}
            iconStyle="from-violet-500 to-blue-600"
          />

        </section>


        {/* =======================================================
            MAIN VENDOR PANEL
        ======================================================== */}

        <section className="mt-7 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl">

          {/* PANEL HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                Vendor Directory
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                All Vendors
              </h2>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {filteredVendors.length} vendor
                {filteredVendors.length !== 1 ? "s" : ""} displayed
              </p>

            </div>


            {/* SEARCH */}

            <div className="relative w-full lg:max-w-sm">

              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search vendors..."
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              />

            </div>

          </div>


          {/* =====================================================
              VENDOR LIST
          ====================================================== */}

          <div className="mt-7">

            {loading ? (

              <div className="space-y-3">

                {[1, 2, 3, 4, 5].map((item) => (

                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-2xl bg-slate-100/80"
                  />

                ))}

              </div>

            ) : filteredVendors.length === 0 ? (

              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 px-6 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                  <UsersIcon className="h-6 w-6 text-slate-400" />

                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {search
                    ? "No vendors found"
                    : "No vendors yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

                  {search
                    ? "Try changing your search term."
                    : "Vendor accounts will appear here once businesses register."}

                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {filteredVendors.map((vendor) => (

                  <div
                    key={vendor._id}
                    className="group rounded-2xl border border-slate-100 bg-white/60 p-4 transition duration-200 hover:bg-white hover:shadow-md"
                  >

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                      {/* VENDOR IDENTITY */}

                      <div className="flex min-w-0 flex-1 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-base font-black text-white shadow-sm">
                          {vendor.name
                            ?.charAt(0)
                            ?.toUpperCase() || "V"}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="truncate text-base font-bold text-slate-900">
                              {vendor.name || "Vendor"}
                            </h3>

                            {vendor.isEmailVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                <CheckCircleIcon className="h-3 w-3" />
                                Verified
                              </span>
                            )}

                          </div>

                          <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">

                            <EnvelopeIcon className="h-4 w-4 shrink-0" />

                            <span className="truncate">
                              {vendor.email}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[360px] xl:grid-cols-2">

                        <div className="flex items-center gap-2">

                          <CalendarDaysIcon className="h-4 w-4 shrink-0 text-slate-400" />

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Joined
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {formatDate(vendor.createdAt)}
                            </p>

                          </div>

                        </div>


                        <div className="flex items-center gap-2">

                          <PowerIcon
                            className={`h-4 w-4 shrink-0 ${
                              vendor.isActive === false
                                ? "text-red-500"
                                : "text-emerald-500"
                            }`}
                          />

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Status
                            </p>

                            <p
                              className={`mt-0.5 text-sm font-bold ${
                                vendor.isActive === false
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {vendor.isActive === false
                                ? "Inactive"
                                : "Active"}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(vendor._id)
                          }
                          disabled={
                            actionLoading === vendor._id
                          }
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            vendor.isActive === false
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >

                          {actionLoading === vendor._id ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <PowerIcon className="h-4 w-4" />

                              {vendor.isActive === false
                                ? "Activate"
                                : "Deactivate"}
                            </>
                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>


        {/* =======================================================
            FOOTER
        ======================================================== */}

        <footer className="py-9 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            MarketHub Platform Administration
          </p>

        </footer>

      </main>

    </div>
  );
};


/* =============================================================
   SUMMARY CARD
============================================================= */

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  iconStyle,
}) => {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-200/20 backdrop-blur-xl">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconStyle} shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

      </div>

      <div className="mt-5">

        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>

        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {value}
        </p>

      </div>

    </div>
  );
};


export default AdminVendors;