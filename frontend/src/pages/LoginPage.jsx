import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../services/api";
import { setUser } from "../store/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      console.log("Login response:", response.data);

      const user = response.data.user;

      // Store logged-in user in Redux
      dispatch(setUser(user));

      // Redirect according to role
      if (user.role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else if (user.role === "SUPER_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Should onnect Google OAuth here later
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-100/50 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-50/70 blur-3xl" />
      </div>

      {/* LOGIN */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50/70 text-teal-600 backdrop-blur-xl">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m10 17 5-5-5-5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />
              </svg>

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to continue to your MarketHub account.
            </p>

          </div>

          {/* FORM CARD */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl sm:p-8">

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* GOOGLE */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/30 hover:text-slate-900"
            >

              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.95 2.94v2.44h3.15c1.85-1.7 2.91-4.2 2.91-7.23Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.64 0 4.86-.87 6.48-2.35l-3.15-2.44c-.87.58-1.98.93-3.33.93-2.56 0-4.73-1.73-5.51-4.05H3.24v2.52A9.79 9.79 0 0 0 12 21.75Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.49 13.84A5.89 5.89 0 0 1 6.18 12c0-.64.11-1.27.31-1.84V7.64H3.24A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05.99 4.36l3.25-2.52Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.11c1.44 0 2.73.49 3.75 1.46l2.81-2.81C16.86 3.18 14.64 2.25 12 2.25a9.79 9.79 0 0 0-8.76 5.39l3.25 2.52C7.27 7.84 9.44 6.11 12 6.11Z"
                />
              </svg>

              Continue with Google

            </button>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                />

              </div>

              {/* PASSWORD */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-teal-600 transition hover:text-teal-700"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                />

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/15 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* REGISTER */}
            <p className="mt-7 text-center text-sm text-slate-500">

              New to MarketHub?{" "}

              <Link
                to="/register"
                className="font-semibold text-teal-600 transition hover:text-teal-700"
              >
                Register here
              </Link>

            </p>

          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our terms and privacy policy.
          </p>

        </div>

      </main>

    </div>
  );
};

export default LoginPage;

