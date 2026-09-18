import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../services/api";
import { setUser} from "../../redux/authSlice";

import {
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = response.data.user;

      if (user.role !== "SUPER_ADMIN") {
        setError(
          "Access denied. This portal is only for administrators."
        );
        return;
      }

      dispatch(setUser(user));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50/40 to-teal-50/50 font-sans text-slate-900">

      {/* =========================================================
          BACKGROUND GLOW
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-blue-300/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-teal-300/15 blur-3xl" />

      </div>


      {/* =========================================================
          TOP NAV
      ========================================================== */}

      <header className="relative z-20 px-4 pt-5 sm:px-6 lg:px-8">

        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/80 bg-white/75 px-4 py-3 shadow-lg shadow-slate-200/30 backdrop-blur-xl sm:px-6">

          <Link
            to="/"
            className="group flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-lg font-black text-white shadow-md shadow-teal-200/60 transition duration-200 group-hover:-translate-y-0.5"
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


          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-bold text-slate-700 backdrop-blur-md transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                Back to Login
              </span>
              <span className="sm:hidden">
                Back
              </span>
            </Link>

          </div>

        </nav>

      </header>


      {/* =========================================================
          MAIN
      ========================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12 sm:px-6">

        <div className="w-full max-w-md">

          {/* =====================================================
              CARD
          ====================================================== */}

          <div className="rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-2xl shadow-slate-300/30 backdrop-blur-2xl sm:p-9">

            {/* ICON */}

            <div className="flex justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-xl shadow-slate-300/30">

                <ShieldCheckIcon className="h-8 w-8 text-cyan-300" />

              </div>

            </div>


            {/* HEADING */}

            <div className="mt-6 text-center">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
                Secure Administration
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Admin Portal
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600">
                Sign in to manage the MarketHub marketplace.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5">

                <p className="text-sm font-semibold leading-6 text-red-700">
                  {error}
                </p>

              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Admin Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}

                  </button>

                </div>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-4 w-4" />
                    Sign in to Admin Portal
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}

              </button>

            </form>


            {/* SECURITY NOTE */}

            <div className="mt-7 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5">

              <div className="flex items-start gap-3">

                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />

                <div>

                  <p className="text-sm font-bold text-slate-700">
                    Authorized administrators only
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This portal is restricted to users with
                    Super Admin access.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <p className="mt-6 text-center text-xs font-medium text-slate-400">
            MarketHub Platform Administration
          </p>

        </div>

      </main>

    </div>
  );
};

export default AdminLogin;