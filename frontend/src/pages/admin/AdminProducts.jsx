import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import {
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingStorefrontIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  ArchiveBoxIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/products"
      );

      const productData =
        response.data?.products ||
        response.data?.data ||
        response.data ||
        [];

      setProducts(
        Array.isArray(productData)
          ? productData
          : []
      );

    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product information."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {

      const productName =
        product.name?.toLowerCase() || "";

      const description =
        product.description?.toLowerCase() ||
        "";

      const storeName =
        product.store?.name?.toLowerCase() ||
        "";

      const vendorName =
        product.vendor?.name?.toLowerCase() ||
        "";

      const vendorEmail =
        product.vendor?.email?.toLowerCase() ||
        "";

      return (
        productName.includes(query) ||
        description.includes(query) ||
        storeName.includes(query) ||
        vendorName.includes(query) ||
        vendorEmail.includes(query)
      );
    });

  }, [products, search]);


  // ==========================================
  // SUMMARY
  // ==========================================

  const totalProducts = products.length;

  const totalVariants = products.reduce(
    (total, product) =>
      total +
      (Array.isArray(product.variants)
        ? product.variants.length
        : 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      Number(product.stock) === 0
  ).length;


  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // IMAGE
  // ==========================================

  const getProductImage = (product) => {
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return null;
  };


  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 font-sans text-slate-900">

      {/* ======================================
          BACKGROUND GLOW
      ======================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-blue-300/10 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-teal-300/10 blur-3xl" />

      </div>


      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ======================================= */}

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
                Admin Products
              </h1>


              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Monitor products across every
                storefront, including inventory,
                variants, vendors and pricing.
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


        {/* ======================================
            ERROR
        ======================================= */}

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
              onClick={fetchProducts}
              className="rounded-xl border border-red-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-white"
            >
              Try Again
            </button>

          </div>
        )}


        {/* ======================================
            SUMMARY CARDS
        ======================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={CubeIcon}
            label="Total Products"
            value={totalProducts}
            iconStyle="from-teal-500 to-cyan-600"
          />


          <SummaryCard
            icon={Squares2X2Icon}
            label="Total Variants"
            value={totalVariants}
            iconStyle="from-violet-500 to-blue-600"
          />


          <SummaryCard
            icon={ArchiveBoxIcon}
            label="Low Stock"
            value={lowStockProducts}
            iconStyle="from-amber-500 to-orange-600"
          />


          <SummaryCard
            icon={ArchiveBoxIcon}
            label="Out of Stock"
            value={outOfStockProducts}
            iconStyle="from-red-500 to-rose-600"
          />

        </section>


        {/* ======================================
            PRODUCT PANEL
        ======================================= */}

        <section className="mt-7 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-xl">

          {/* PANEL HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                Product Directory
              </p>


              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                All Products
              </h2>


              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
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
                placeholder="Search products, stores..."
                className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
              />

            </div>

          </div>


          {/* ======================================
              PRODUCT LIST
          ======================================= */}

          <div className="mt-7">

            {loading ? (

              <div className="space-y-3">

                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-32 animate-pulse rounded-2xl bg-slate-100/80"
                    />
                  )
                )}

              </div>

            ) : filteredProducts.length === 0 ? (

              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 px-6 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                  <CubeIcon className="h-6 w-6 text-slate-400" />

                </div>


                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {search
                    ? "No products found"
                    : "No products yet"}
                </h3>


                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

                  {search
                    ? "Try changing your search term."
                    : "Products will appear here once vendors add them to their stores."}

                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {filteredProducts.map(
                  (product) => {

                    const image =
                      getProductImage(
                        product
                      );

                    const stock =
                      Number(
                        product.stock
                      ) || 0;

                    return (
                      <div
                        key={product._id}
                        className="group rounded-2xl border border-slate-100 bg-white/60 p-4 transition duration-200 hover:bg-white hover:shadow-md"
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                          {/* =================================
                              PRODUCT IMAGE
                          ================================== */}

                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">

                            {image ? (

                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center">

                                <CubeIcon className="h-8 w-8 text-slate-300" />

                              </div>

                            )}

                          </div>


                          {/* =================================
                              PRODUCT IDENTITY
                          ================================== */}

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-lg font-black text-slate-900">
                              {product.name ||
                                "Unnamed Product"}
                            </h3>


                            {product.description && (
                              <p className="mt-1 line-clamp-1 max-w-xl text-sm text-slate-500">
                                {
                                  product.description
                                }
                              </p>
                            )}


                            {/* STORE */}

                            <div className="mt-3 flex flex-wrap items-center gap-4">

                              <div className="flex items-center gap-1.5">

                                <BuildingStorefrontIcon className="h-4 w-4 text-slate-400" />

                                <span className="text-xs font-bold text-slate-600">
                                  {product.store
                                    ?.name ||
                                    "Unknown Store"}
                                </span>

                              </div>


                              <div className="flex items-center gap-1.5">

                                <UserIcon className="h-4 w-4 text-slate-400" />

                                <span className="text-xs font-medium text-slate-500">
                                  {product.vendor
                                    ?.name ||
                                    "Unknown Vendor"}
                                </span>

                              </div>

                            </div>

                          </div>


                          {/* =================================
                              PRICE
                          ================================== */}

                          <div className="flex items-center gap-2 lg:w-[120px]">

                            <CurrencyRupeeIcon className="h-4 w-4 text-teal-600" />

                            <div>

                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Price
                              </p>

                              <p className="mt-0.5 text-sm font-black text-slate-900">
                                ₹
                                {Number(
                                  product.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                          </div>


                          {/* =================================
                              STOCK
                          ================================== */}

                          <div className="lg:w-[130px]">

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Stock
                            </p>


                            <div className="mt-1 flex items-center gap-2">

                              <span
                                className={`h-2 w-2 rounded-full ${
                                  stock === 0
                                    ? "bg-red-500"
                                    : stock <= 5
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                              />


                              <span
                                className={`text-sm font-bold ${
                                  stock === 0
                                    ? "text-red-600"
                                    : stock <= 5
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {stock === 0
                                  ? "Out of stock"
                                  : `${stock} units`}
                              </span>

                            </div>

                          </div>


                          {/* =================================
                              VARIANTS
                          ================================== */}

                          <div className="lg:w-[100px]">

                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Variants
                            </p>


                            <p className="mt-1 text-sm font-bold text-slate-700">
                              {Array.isArray(
                                product.variants
                              )
                                ? product
                                    .variants
                                    .length
                                : 0}
                            </p>

                          </div>


                          {/* =================================
                              DATE
                          ================================== */}

                          <div className="flex items-center gap-2 lg:w-[120px]">

                            <CalendarDaysIcon className="h-4 w-4 text-slate-400" />

                            <div>

                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Added
                              </p>

                              <p className="mt-0.5 text-xs font-semibold text-slate-600">
                                {formatDate(
                                  product.createdAt
                                )}
                              </p>

                            </div>

                          </div>


                          {/* =================================
                              ACTION
                          ================================== */}

                          <div className="shrink-0">

                            <Link
                              to={`/admin/products/${product._id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:border-teal-300 hover:bg-teal-100"
                            >
                              View

                              <ArrowRightIcon className="h-4 w-4" />

                            </Link>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

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
// SUMMARY CARD
// ==========================================

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  iconStyle,
}) => {
  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-5 shadow-lg shadow-slate-200/20 backdrop-blur-xl">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">

        <Icon className="h-5 w-5 text-white" />

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


export default AdminProducts;