import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import api from "../services/api";

const VerifyEmailPage = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        setStatus("success");

        setMessage(
          response.data?.message ||
            "Email verified successfully. You can now log in."
        );
      } catch (error) {
        console.error("Email verification error:", error);

        /*
         * If the verification request succeeded on the backend
         * but the browser/network produced a duplicate request,
         * don't blindly overwrite a successful verification state.
         */
        setStatus("error");

        setMessage(
          error.response?.data?.message ||
            "This verification link is invalid or has expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 text-slate-900">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/4 rounded-full bg-teal-100/50 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      {/* Main */}
      <main className="relative z-10 flex min-h-screen items-center justify-center py-10">

        <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/75 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-2xl sm:p-10">

          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Please wait while we verify your MarketHub account.
              </p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <CheckCircleIcon className="h-9 w-9" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Email verified
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {message}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Your MarketHub account is now ready to use.
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue to Login
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <XCircleIcon className="h-9 w-9" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Verification failed
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {message}
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-teal-200 hover:bg-teal-50/50"
              >
                Back to Login
              </Link>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;

