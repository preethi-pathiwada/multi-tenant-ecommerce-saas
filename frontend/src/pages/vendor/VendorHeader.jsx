import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  BuildingStorefrontIcon,
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import api from "../../services/api";

const VendorHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-300 ${
      isActive
        ? "bg-white/80 text-teal-700 shadow-sm ring-1 ring-white/70"
        : "text-slate-600 hover:bg-white/55 hover:text-teal-700"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-white/80 text-teal-700 shadow-sm ring-1 ring-white/70"
        : "bg-white/30 text-slate-700 hover:bg-white/60"
    }`;

  return (
    <>
      {/* HEADER */}
      <header className="relative z-50 rounded-2xl border border-white/70 bg-white/45 px-2 py-3 shadow-md shadow-slate-200/30 backdrop-blur-xl sm:px-4">

        <div className="flex min-h-[48px] items-center justify-between gap-3">

          {/* LOGO */}
          <Link
            to="/vendor/dashboard"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-lg font-bold text-white shadow-md shadow-teal-200/60 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              O
            </div>

            <div className="">
                <p className="text-lg font-bold tracking-tight text-slate-900">
                  Orbi<span className="text-teal-600">Kart</span>
                </p>
              </div>
          </Link>

          
          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-0.5 lg:flex">

            {/* DASHBOARD */}
            <NavLink
              to="/vendor/dashboard"
              className={navLinkClass}
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </NavLink>

            {/* MY STORE */}
            <NavLink
              to="/vendor/store"
              className={navLinkClass}
            >
              <BuildingStorefrontIcon className="h-4 w-4" />
              My Store
            </NavLink>

            {/* PRODUCTS */}
            <NavLink
              to="/vendor/products"
              className={navLinkClass}
            >
              <CubeIcon className="h-4 w-4" />
              Products
            </NavLink>

            {/* ORDERS */}
            <NavLink
              to="/vendor/orders"
              className={navLinkClass}
            >
              <ShoppingBagIcon className="h-4 w-4" />
              Orders
            </NavLink>

            {/* LOGOUT */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="ml-1 flex items-center gap-2 rounded-xl px-3 py-1.5 text-[13px] font-semibold text-red-500 transition-all duration-300 hover:bg-red-50/70 hover:text-red-600"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>

          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/45 text-slate-700 transition-all duration-300 hover:bg-white/70 lg:hidden"
            aria-label="Toggle navigation"
          >
            {isMobileOpen ? (
              <XMarkIcon className="h-4.5 w-4.5" />
            ) : (
              <Bars3Icon className="h-4.5 w-4.5" />
            )}
          </button>

        </div>

        {/* MOBILE NAVIGATION */}
        {isMobileOpen && (
          <div className="mt-2 border-t border-white/50 pt-2.5 lg:hidden">

            <div className="grid grid-cols-2 gap-1.5">

              {/* DASHBOARD */}
              <NavLink
                to="/vendor/dashboard"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                <HomeIcon className="h-4.5 w-4.5" />
                Dashboard
              </NavLink>

              {/* MY STORE */}
              <NavLink
                to="/vendor/store"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                <BuildingStorefrontIcon className="h-4.5 w-4.5" />
                My Store
              </NavLink>

              {/* PRODUCTS */}
              <NavLink
                to="/vendor/products"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                <CubeIcon className="h-4.5 w-4.5" />
                Products
              </NavLink>

              {/* ORDERS */}
              <NavLink
                to="/vendor/orders"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                <ShoppingBagIcon className="h-4.5 w-4.5" />
                Orders
              </NavLink>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  setShowLogoutModal(true);
                }}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-red-50/50 px-3 py-2.5 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="h-4.5 w-4.5" />
                Logout
              </button>

            </div>

          </div>
        )}
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-7 shadow-2xl backdrop-blur-xl">

            {/* MODAL HEADER */}
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Logout?
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Are you sure you want to logout from your vendor account?
                </p>
              </div>

            </div>

            {/* MODAL BUTTONS */}
            <div className="mt-7 flex gap-3">

              {/* NO */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50"
              >
                No
              </button>

              {/* YES */}
              <button
                onClick={handleLogout}
                className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                Yes, Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default VendorHeader;