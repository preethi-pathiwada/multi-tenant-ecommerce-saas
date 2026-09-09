
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <header className="relative z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-slate-200/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Market<span className="text-teal-600">Hub</span>
            </span>

          </Link>


          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#features"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              Features
            </a>

            <a
              href="#vendors"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              For Vendors
            </a>

            <a
              href="#about"
              className="text-sm text-slate-600 transition hover:text-teal-600"
            >
              About
            </a>

          </div>


          {/* Authentication */}
          <div className="flex items-center gap-2">

            <Link
              to="/login"
              className="hidden px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-teal-600 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Get Started
            </Link>

          </div>

        </nav>
      </header>


      {/* =========================================================
          HERO
      ========================================================== */}
      <main>

        <section className="relative">

          {/* Very subtle background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

            <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-100/50 blur-3xl sm:h-96 sm:w-96" />

          </div>


          <div className="mx-auto max-w-6xl px-4 pb-0 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pt-28">

            <div className="mx-auto max-w-3xl text-center">

              {/* Small label */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/60 px-4 py-2 text-xs font-medium text-teal-700 backdrop-blur-md sm:text-sm">

                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />

                A modern e-commerce ecosystem

              </div>


              {/* Main Heading */}
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">

                One platform.

                <span className="block text-teal-600">
                  Multiple possibilities.
                </span>

              </h1>


              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                MarketHub brings vendors and customers together through a
                powerful multi-tenant e-commerce platform built for modern
                businesses.

              </p>


              {/* CTA */}
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/15 transition hover:bg-teal-700"
                >
                  Create your store

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>

                </Link>


                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition hover:border-teal-200 hover:text-teal-600"
                >
                  Explore platform
                </a>

              </div>

            </div>


        
          </div>

        </section>


        {/* =========================================================
            FEATURES
        ========================================================== */}
        <section
          id="features"
          className="border-y border-slate-100 bg-slate-50/60"
        >

          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">
                The platform
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything connected.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                A single ecosystem designed to make online commerce simpler
                for both businesses and customers.
              </p>

            </div>


            {/* Three simple feature blocks */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">

              <Feature
                number="01"
                title="Independent storefronts"
                description="Each vendor gets a dedicated store experience while remaining part of the larger marketplace."
              />

              <Feature
                number="02"
                title="Centralized management"
                description="Products, inventory, orders and business operations stay organized inside one dashboard."
              />

              <Feature
                number="03"
                title="Seamless shopping"
                description="Customers can discover products, explore stores and complete purchases through one platform."
              />

            </div>

          </div>

        </section>


        {/* =========================================================
            VENDOR CTA
        ========================================================== */}
        <section id="vendors" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

          <div className="mx-auto max-w-6xl">

            <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 sm:px-12 sm:py-16 lg:px-16">

              {/* Minimal background glow */}
              <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />


              <div className="relative max-w-2xl">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
                  For vendors
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Bring your business online.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Create your storefront, manage your products and start
                  connecting with customers through one powerful platform.
                </p>

                <Link
                  to="/register"
                  className="mt-8 inline-flex rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-400"
                >
                  Start selling
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================================
            FOOTER
        ========================================================== */}
        <footer
          id="about"
          className="border-t border-slate-100 bg-white"
        >

          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <Link
                  to="/"
                  className="text-lg font-semibold tracking-tight"
                >
                  Market<span className="text-teal-600">Hub</span>
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  A modern multi-tenant e-commerce platform.
                </p>

              </div>


              <div className="flex flex-wrap gap-5 text-xs text-slate-500">

                <a
                  href="#features"
                  className="transition hover:text-teal-600"
                >
                  Features
                </a>

                <a
                  href="#vendors"
                  className="transition hover:text-teal-600"
                >
                  Vendors
                </a>

                <Link
                  to="/login"
                  className="transition hover:text-teal-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="transition hover:text-teal-600"
                >
                  Register
                </Link>

              </div>

            </div>


            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400 sm:text-left">
              © {new Date().getFullYear()} MarketHub. All rights reserved.
            </div>

          </div>

        </footer>

      </main>

    </div>
  );
};


/* =============================================================
   FEATURE COMPONENT
============================================================= */

const Feature = ({ number, title, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl">

      <span className="text-xs font-semibold tracking-widest text-teal-600">
        {number}
      </span>

      <h3 className="mt-5 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
};


export default HomePage;
