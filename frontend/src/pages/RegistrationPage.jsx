import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { GoogleLogin } from "@react-oauth/google";

import api from "../services/api";

import { setUser } from "../redux/authSlice";

import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserPlusIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {};

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // NAME

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = "Please enter a valid name.";
    }

    // EMAIL

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // PASSWORD

    if (!formData.password) {
      newErrors.password = "Please create a password.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    // ROLE

    if (!["CUSTOMER", "VENDOR"].includes(formData.role)) {
      newErrors.role = "Please select a valid account type.";
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
    setSuccess("");

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // NORMAL REGISTRATION
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      console.log("Registration response:", response.data);

      setSuccess(
        response.data.message ||
          "Registration successful. Please check your email to verify your account."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
      });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE SIGNUP
  // =========================

  const handleGoogleSignup = async (credentialResponse) => {
    setError("");
    setSuccess("");

    if (!credentialResponse?.credential) {
      setError("Google authentication failed. Please try again.");
      return;
    }

    setGoogleLoading(true);

    try {
      console.log("Google credential received");

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
        role: formData.role,
      });

      console.log("Google signup response:", response.data);

      const user = response.data.user;

      if (!user) {
        throw new Error("User information was not returned.");
      }

      dispatch(setUser(user));

      if (user.role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else if (user.role === "SUPER_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to sign up with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // =========================
  // GOOGLE ERROR
  // =========================

  const handleGoogleError = () => {
    console.error("Google signup failed");

    setError(
      "Google sign-up was cancelled or failed. Please try again."
    );
  };

  // =========================
  // INPUT STYLES
  // =========================

  const inputBase =
    "w-full rounded-xl border bg-white/65 px-4 py-3.5 pl-11 text-sm text-slate-900 outline-none backdrop-blur-xl transition-all duration-200 placeholder:text-slate-400";

  const normalInput =
    "border-slate-200/80 hover:border-teal-300 focus:border-teal-500 focus:bg-white/90 focus:ring-4 focus:ring-teal-500/10";

  const errorInput =
    "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50/50 to-teal-50/70 text-slate-900">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-teal-300/20 blur-3xl" />

        <div className="absolute right-[-140px] top-20 h-[480px] w-[480px] rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute bottom-[-200px] left-1/3 h-[450px] w-[450px] rounded-full bg-blue-300/15 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_58%)]" />

      </div>

      {/* ================= NAVBAR ================= */}

      <header className="relative z-10 px-3 pt-3 sm:px-5 lg:px-6">

        <nav className="mx-auto flex min-h-[50px] max-w-6xl items-center justify-between rounded-2xl border border-white/75 bg-white/45 px-3 py-2 shadow-md shadow-slate-200/30 backdrop-blur-xl sm:px-4">

          {/* LOGO */}

          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-200/60">
              <BuildingStorefrontIcon className="h-4.5 w-4.5" />
            </div>

            <span className="text-sm font-black tracking-tight text-slate-800 sm:text-base">
              Orbi<span className="text-teal-600">Kart</span>
            </span>
          </Link>

          {/* LOGIN */}

          <Link
            to="/login"
            className="rounded-xl border border-white/80 bg-white/65 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all duration-300 hover:border-teal-200 hover:bg-white hover:text-teal-700 sm:px-4 sm:text-sm"
          >
            Login
          </Link>

        </nav>

      </header>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 flex items-center justify-center px-4 py-9 sm:px-6 sm:py-11">

        <div className="w-full max-w-[430px]">

          {/* HEADER */}

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 text-teal-600 shadow-sm shadow-teal-200/40 backdrop-blur-xl">
              <UserPlusIcon className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2.15rem]">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join OrbiKart and start your journey today.
            </p>

          </div>

          {/* CARD */}

          <div className="rounded-[1.75rem] border border-white/80 bg-white/60 p-5 shadow-xl shadow-slate-300/20 backdrop-blur-2xl sm:p-7">

            {/* ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3.5 text-sm text-emerald-700 backdrop-blur-sm">

                <div className="flex items-start gap-3">

                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>

                    <p className="font-bold">
                      Account created successfully
                    </p>

                    <p className="mt-1 leading-6">
                      {success}
                    </p>

                    <Link
                      to="/login"
                      className="mt-2.5 inline-block font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                    >
                      Continue to Login
                    </Link>

                  </div>

                </div>

              </div>
            )}

            {/* GOOGLE */}

            <div className="relative flex min-h-[44px] w-full justify-center overflow-hidden rounded-xl">

              {googleLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">

                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">

                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />

                    Signing up with Google...

                  </div>

                </div>
              )}

              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={handleGoogleError}
                theme="outline"
                shape="rectangular"
                size="large"
                text="signup_with"
                width="100%"
              />

            </div>

            {/* DIVIDER */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600"
                >
                  Full name
                </label>

                <div className="relative">

                  <UserIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${inputBase} ${
                      errors.name ? errorInput : normalInput
                    }`}
                  />

                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600"
                >
                  Email address
                </label>

                <div className="relative">

                  <EnvelopeIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`${inputBase} ${
                      errors.email ? errorInput : normalInput
                    }`}
                  />

                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600"
                >
                  Password
                </label>

                <div className="relative">

                  <LockClosedIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`${inputBase} pr-12 ${
                      errors.password ? errorInput : normalInput
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-teal-50 hover:text-teal-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.password ? (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                    8+ characters with uppercase, lowercase, number & symbol.
                  </p>
                )}

              </div>

              {/* ROLE */}

              <div>

                <label
                  htmlFor="role"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600"
                >
                  Account type
                </label>

                <div className="relative">

                  <BuildingStorefrontIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputBase} appearance-none cursor-pointer pl-11 font-medium ${
                      errors.role
                        ? errorInput
                        : normalInput
                    }`}
                  >

                    <option value="CUSTOMER">
                      Customer
                    </option>

                    <option value="VENDOR">
                      Vendor
                    </option>

                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ▼
                  </div>

                </div>

                {errors.role ? (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.role}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                    Customer to shop or Vendor to manage your store.
                  </p>
                )}

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <UserPlusIcon className="h-5 w-5" />

                {loading
                  ? "Creating account..."
                  : "Create account"}

              </button>

            </form>

            {/* LOGIN */}

            <p className="mt-6 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-bold text-teal-600 transition hover:text-teal-700"
              >
                Login here
              </Link>

            </p>

          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
            By creating an account, you agree to our terms and privacy policy.
          </p>

        </div>

      </main>

    </div>
  );
};

export default RegistrationPage;