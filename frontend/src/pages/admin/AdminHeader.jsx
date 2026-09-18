import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiX,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";

const AdminHeader = () => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  const adminName = user?.name || "Super Admin";

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: FiGrid,
    },
    {
      name: "Vendors",
      path: "/admin/vendors",
      icon: FiUsers,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: FiUsers,
    },
    {
      name: "Stores",
      path: "/admin/stores",
      icon: FaStore,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
  ];

  const handleNavigation = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">

      <div className="mx-auto max-w-[1500px]">

        <div className="relative rounded-[28px] border border-white/90 bg-white/75 shadow-[0_12px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">

          {/* =====================================================
              DESKTOP / MAIN HEADER
          ====================================================== */}

          <div className="flex min-h-[76px] items-center px-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <Link
              to="/admin/dashboard"
              onClick={handleNavigation}
              className="group flex shrink-0 items-center gap-3"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500 text-xl font-black text-white shadow-[0_8px_22px_rgba(6,182,212,0.25)] transition duration-300 group-hover:-translate-y-0.5">
                O
              </div>

              <div className="hidden sm:block">

                <div className="text-[20px] font-black tracking-[-0.04em] text-slate-900">
                  Or<span className="text-cyan-500">bi</span>Kart
                </div>

                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Admin Console
                </p>

              </div>

            </Link>


            {/* DESKTOP NAVIGATION */}
            <nav className="ml-6 hidden flex-1 items-center justify-center lg:flex">

              <div className="flex items-center gap-1 rounded-2xl bg-slate-50/70 p-1">

                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavigation}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-cyan-50 text-cyan-700 shadow-sm"
                            : "text-slate-500 hover:bg-white hover:text-slate-800"
                        }`
                      }
                    >

                      <Icon
                        size={15}
                        strokeWidth={2}
                        className="transition-transform duration-200 group-hover:scale-105"
                      />

                      <span>
                        {item.name}
                      </span>

                    </NavLink>
                  );
                })}

              </div>

            </nav>


            {/* RIGHT SIDE */}
            <div className="ml-auto flex items-center gap-2">

              {/* ADMIN PROFILE */}
              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((prev) => !prev)
                  }
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/75 px-3 py-2 transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-sm font-black text-white">
                    {adminName.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden text-left sm:block">

                    <p className="max-w-[110px] truncate text-sm font-bold text-slate-800">
                      {adminName}
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-600">
                      Super Admin
                    </p>

                  </div>

                  <FiChevronDown
                    size={16}
                    className={`hidden text-slate-400 transition-transform sm:block ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-2xl border border-white/90 bg-white/95 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur-2xl">

                    <div className="border-b border-slate-100 px-3 py-3">

                      <p className="text-sm font-black text-slate-900">
                        {adminName}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-600">
                        Super Admin
                      </p>

                    </div>


                    <Link
                      to="/admin/dashboard"
                      onClick={handleNavigation}
                      className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      <FiGrid size={16} />
                      Dashboard
                    </Link>


                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}

              </div>


              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setMobileOpen((prev) => !prev)
                }
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 lg:hidden"
              >

                {mobileOpen ? (
                  <FiX size={21} />
                ) : (
                  <FiMenu size={21} />
                )}

              </button>

            </div>

          </div>


          {/* =====================================================
              MOBILE NAVIGATION
          ====================================================== */}

          {mobileOpen && (
            <div className="border-t border-slate-100 px-4 pb-4 pt-3 lg:hidden">

              <div className="grid gap-1.5 sm:grid-cols-2">

                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavigation}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                          isActive
                            ? "bg-cyan-50 text-cyan-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                        <Icon size={17} />
                      </div>

                      {item.name}

                    </NavLink>
                  );
                })}

              </div>


              {/* MOBILE LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <FiLogOut size={17} />
                </div>

                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default AdminHeader;