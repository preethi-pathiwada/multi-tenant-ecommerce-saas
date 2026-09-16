import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import api from "../../services/api";

const CustomerHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <header className="relative z-50 mb-8">
      <nav className="mx-auto max-w-7xl rounded-3xl border border-white/80 bg-white/75 px-4 py-3 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:px-6 lg:px-8">

        <div className="flex items-center justify-between">

          {/* =====================================================
              LOGO
          ====================================================== */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-lg font-bold text-white shadow-md shadow-teal-200/60 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg"
            >
              M
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Market<span className="text-teal-600">Hub</span>
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Your Marketplace
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <div className="hidden items-center gap-2 md:flex">

            <Link
              to="/"
              className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:from-teal-100 hover:to-cyan-100"
            >
              Home
            </Link>

            <Link
              to="/my-orders"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              My Orders
            </Link>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Cart */}
            <Link
              to="/cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              aria-label="Shopping Cart"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h13m-9 0a2 2 0 11-4 0m10 0a2 2 0 11-4 0"
                />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-1 text-[10px] font-bold text-white shadow-md shadow-teal-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =================================================
                ACCOUNT
            ================================================== */}
            <div className="group relative">

              <button
                type="button"
                className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 transition duration-200 hover:border-teal-200 hover:bg-teal-50/70"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
                    {user?.name || "Account"}
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-wider text-teal-600">
                    Customer
                  </p>
                </div>

                <svg
                  className="h-4 w-4 text-slate-400 transition group-hover:text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              <div className="invisible absolute right-0 top-[calc(100%+10px)] w-60 translate-y-2 rounded-3xl border border-white/80 bg-white/90 p-2 opacity-0 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                <div className="rounded-2xl bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user?.name || "Customer"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {user?.email || ""}
                  </p>
                </div>

                <Link
                  to="/my-orders"
                  className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-sm">
                    📦
                  </span>
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-sm">
                    🛒
                  </span>
                  Cart
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50">
                    ↪
                  </span>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              MOBILE BUTTON
          ====================================================== */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 md:hidden"
          >
            {menuOpen ? (
              <span className="text-lg">✕</span>
            ) : (
              <span className="text-lg">☰</span>
            )}
          </button>

        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
        {menuOpen && (
          <div className="mt-4 border-t border-slate-200/70 pt-4 md:hidden">

            <div className="space-y-2">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 text-sm font-semibold text-teal-700"
              >
                <span>⌂</span>
                Home
              </Link>

              <Link
                to="/my-orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <span>📦</span>
                My Orders
              </Link>

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <span className="flex items-center gap-3">
                  <span>🛒</span>
                  Cart
                </span>

                {cartCount > 0 && (
                  <span className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-2.5 py-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="mt-3 rounded-2xl bg-gradient-to-r from-slate-50 to-cyan-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  {user?.name || "Customer"}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <span>↪</span>
                Logout
              </button>

            </div>
          </div>
        )}

      </nav>
    </header>
  );
};

export default CustomerHeader;