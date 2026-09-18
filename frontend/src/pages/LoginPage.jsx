import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { GoogleLogin } from "@react-oauth/google";

import api from "../services/api";

import { setUser } from "../redux/authSlice";

import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // ROLE REDIRECT
  // =========================

  const redirectUser = async (user) => {
    // -------------------------
    // VENDOR
    // -------------------------
    if (user.role === "VENDOR") {
      try {
        // Check whether this vendor already has a store
        await api.get("/stores/my-store");

        // Store exists
        navigate("/vendor/dashboard");
      } catch (error) {
        // Store does not exist
        if (error.response?.status === 404) {
          navigate("/vendor/create-store");
        } else {
          console.error("Store check failed:", error);

          setError(
            "Unable to check your store information. Please try again."
          );
        }
      }

      return;
    }

    // -------------------------
    // SUPER ADMIN
    // -------------------------
    if (user.role === "SUPER_ADMIN") {
      navigate("/admin/dashboard");
      return;
    }

    // -------------------------
    // CUSTOMER
    // -------------------------
    navigate("/");
  };

  // =========================
  // NORMAL LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Login response:", response.data);

      const user = response.data.user;

      if (!user) {
        throw new Error("User information was not returned.");
      }

      // Save logged-in user
      dispatch(setUser(user));

      // Redirect according to role + store status
      await redirectUser(user);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin = async (credentialResponse) => {
    setError("");

    if (!credentialResponse?.credential) {
      setError("Google authentication failed. Please try again.");
      return;
    }

    setGoogleLoading(true);

    try {
      console.log("Google credential received");

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      console.log("Google login response:", response.data);

      const user = response.data.user;

      if (!user) {
        throw new Error("User information was not returned.");
      }

      // Save logged-in user
      dispatch(setUser(user));

      // Redirect according to role + store status
      await redirectUser(user);
    } catch (error) {
      console.error("Google login error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to sign in with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================
  // GOOGLE ERROR
  // =========================

  const handleGoogleError = () => {
    console.error("Google login failed");

    setError(
      "Google sign-in was cancelled or failed. Please try again."
    );
  };

  // =========================
  // INPUT STYLES
  // =========================

  const inputBase =
    "w-full rounded-2xl border bg-white/80 px-4 py-3.5 pl-12 text-sm text-slate-900 outline-none backdrop-blur-xl transition-all duration-200 placeholder:text-slate-400";

  const normalInput =
    "border-slate-300 hover:border-teal-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

  const errorInput =
    "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#b2dfdb] text-slate-900">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="absolute right-[-120px] top-20 h-[420px] w-[420px] rounded-full bg-cyan-200/25 blur-3xl" />

        <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-violet-200/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%)]" />
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="relative z-10 px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:px-5">

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20">
              <BuildingStorefrontIcon className="h-5 w-5" />
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              Market<span className="text-teal-600">Hub</span>
            </span>
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-slate-200/90 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            Create Account
          </Link>
        </nav>
      </header>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

        <div className="w-full max-w-md">

          {/* HEADER */}

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 shadow-sm shadow-teal-200/40">
              <ArrowRightOnRectangleIcon className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to continue to your MarketHub account.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-[2rem] border border-white/90 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">

            {/* ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3.5 text-sm text-red-600">
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* GOOGLE */}

            <div className="relative flex min-h-[44px] w-full justify-center overflow-hidden rounded-2xl">

              {googleLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
                    Signing in with Google...
                  </div>
                </div>
              )}

              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                theme="outline"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>

            {/* DIVIDER */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              <span className="text-[11px] font-bold tracking-widest text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`${inputBase} ${
                      errors.email ? errorInput : normalInput
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${inputBase} pr-12 ${
                      errors.password ? errorInput : normalInput
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-teal-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />

                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* REGISTER */}

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-teal-600 transition hover:text-teal-700"
              >
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Secure authentication powered by MarketHub.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
