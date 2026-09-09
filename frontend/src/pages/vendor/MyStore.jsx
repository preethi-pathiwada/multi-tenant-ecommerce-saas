import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const MyStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores/my-store");

        setStore(response.data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your store...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- STORE NOT FOUND ---------------- */

  if (!store) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5M5.25 9.75V21h13.5V9.75"
              />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-950">
            Store not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We couldn't find a store associated with your vendor account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-50/50">
      {/* SUBTLE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-50/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
              Store management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              My Store
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your storefront information and keep your business
              details up to date.
            </p>
          </div>

          <button
            onClick={() => navigate("/vendor/store/edit")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.687a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13l-2.685.896.896-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 7.125 16.875 4.5"
              />
            </svg>

            Edit Store
          </button>
        </div>

        {/* ================= STORE CARD ================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 shadow-xl shadow-slate-200/30 backdrop-blur-2xl">
          {/* STORE COVER */}

          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-slate-100 sm:h-52">
            {/* Decorative glass circles */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-teal-100/60 blur-3xl" />

            <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-white/80 blur-3xl" />

            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

            <div className="relative flex h-full items-center justify-center">
              <div className="rounded-2xl border border-white/70 bg-white/50 px-5 py-2.5 backdrop-blur-xl">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Your storefront
                </span>
              </div>
            </div>
          </div>

          {/* STORE CONTENT */}

          <div className="relative px-5 pb-7 sm:px-8 sm:pb-9">
            {/* STORE LOGO */}

            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-teal-50 shadow-lg shadow-slate-200/50">
              <span className="text-3xl font-bold text-teal-600">
                {store.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </div>

            {/* STORE NAME + STATUS */}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {store.name}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    Active
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Your MarketHub storefront
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-7 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                About your store
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {store.description || "No description has been added yet."}
              </p>
            </div>

            {/* STORE DETAILS */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* STORE NAME */}

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h1M9 11h1M9 15h1M14 7h1M14 11h1M14 15h1"
                      />
                    </svg>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Store name
                  </p>
                </div>

                <p className="mt-4 text-base font-semibold text-slate-900">
                  {store.name}
                </p>
              </div>

              {/* STORE SLUG */}

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 0 0-6.38 0l-2.12 2.12a4.5 4.5 0 1 0 6.38 6.38l1.06-1.06m-1.32-6.38a4.5 4.5 0 0 1 6.38 0l2.12 2.12a4.5 4.5 0 0 1-6.38 6.38l-1.06-1.06"
                      />
                    </svg>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Store slug
                  </p>
                </div>

                <p className="mt-4 break-all text-base font-semibold text-slate-900">
                  {store.slug}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">
              <button
                onClick={() => navigate("/vendor/store/edit")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-600"
              >
                Edit Store Details
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                View Store
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStore;
  


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";


// const MyStore = () => {
//   const [store, setStore] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStore = async () => {
//       try {
//         const response = await api.get("/stores/my-store");

//         setStore(response.data.store);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStore();
//   }, []);

//   if (loading) {
//     return <div className="p-6">Loading store...</div>;
//   }

//   if (!store) {
//     return <div className="p-6">Store not found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
//         <h1 className="text-3xl font-bold">
//           My Store
//         </h1>

//         <div className="mt-6 space-y-4">
//           <div>
//             <p className="text-sm text-gray-500">
//               Store Name
//             </p>

//             <p className="text-lg font-semibold">
//               {store.name}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Store Slug
//             </p>

//             <p className="text-lg">
//               {store.slug}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Description
//             </p>

//             <p className="text-lg">
//               {store.description || "No description"}
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/vendor/store/edit")}
//             className="mt-6 rounded bg-black px-5 py-3 text-white"
//             >
//             Edit Store
//         </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyStore;