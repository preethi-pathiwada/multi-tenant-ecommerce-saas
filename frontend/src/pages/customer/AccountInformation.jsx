import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import CustomerHeader from "./CustomerHeader";

const AccountInformation = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, addressResponse] = await Promise.all([
        api.get("/users/me"),
        api.get("/addresses"),
      ]);

      const currentUser = userResponse.data.user;

      setUser(currentUser);
      setName(currentUser.name || "");
      setAddresses(addressResponse.data.addresses || []);
    } catch (err) {
      console.error("Failed to load account information:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load account information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put("/users/me", {
        name: name.trim(),
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setName(updatedUser.name);
      setEditing(false);

      setMessage("Your account information has been updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update your information."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  const defaultAddress = addresses.find(
    (address) => address.isDefault
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
        <CustomerHeader />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
            <p className="text-sm text-white/60">
              Loading account information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
        <CustomerHeader />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <p className="mb-5 text-white/70">
              Unable to load your account information.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      <CustomerHeader />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-cyan-300"
          >
            ← Back to Store
          </Link>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              My Account
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Account Information
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Manage your personal information and saved delivery
              addresses from one place.
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-sm text-emerald-200 backdrop-blur-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-300/20 bg-red-300/10 px-5 py-4 text-sm text-red-200 backdrop-blur-xl">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Personal Information */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Profile
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Personal Information
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Keep your account details up to date.
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                    setError("");
                  }}
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
                >
                  Edit
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-white/35">
                    Full Name
                  </p>

                  <p className="text-base font-medium text-white">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-white/35">
                    Email Address
                  </p>

                  <p className="break-all text-base font-medium text-white">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-white/35">
                    Account Type
                  </p>

                  <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    Customer
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:bg-white/[0.08]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-white/40 outline-none"
                  />

                  <p className="mt-2 text-xs text-white/30">
                    Email address cannot be changed here.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Address Overview */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Delivery
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Saved Addresses
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Manage your delivery addresses for faster checkout.
              </p>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-5">
              <div>
                <p className="text-sm text-white/50">
                  Total saved addresses
                </p>

                <p className="mt-1 text-3xl font-semibold text-white">
                  {addresses.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl">
                📍
              </div>
            </div>

            {defaultAddress ? (
              <div className="mb-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Default Address
                  </p>

                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                    {defaultAddress.label}
                  </span>
                </div>

                <p className="font-medium text-white">
                  {defaultAddress.name}
                </p>

                <p className="mt-1 text-sm text-white/55">
                  {defaultAddress.address}
                </p>

                <p className="text-sm text-white/55">
                  {defaultAddress.city}, {defaultAddress.state}{" "}
                  {defaultAddress.pincode}
                </p>

                <p className="mt-2 text-sm text-white/40">
                  {defaultAddress.phone}
                </p>
              </div>
            ) : (
              <div className="mb-6 rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center">
                <p className="text-sm text-white/50">
                  You haven't saved any addresses yet.
                </p>
              </div>
            )}

            <Link
              to="/manage-addresses"
              className="flex w-full items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/20 hover:text-cyan-100"
            >
              Manage Addresses
            </Link>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Quick Access
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Account Actions
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/my-orders"
              className="group rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05]"
            >
              <p className="mb-2 text-lg">📦</p>

              <p className="font-medium text-white transition group-hover:text-cyan-200">
                My Orders
              </p>

              <p className="mt-1 text-sm text-white/40">
                View your order history
              </p>
            </Link>

            <Link
              to="/cart"
              className="group rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05]"
            >
              <p className="mb-2 text-lg">🛒</p>

              <p className="font-medium text-white transition group-hover:text-cyan-200">
                Shopping Cart
              </p>

              <p className="mt-1 text-sm text-white/40">
                Review items waiting in your cart
              </p>
            </Link>

            <button
              onClick={handleLogout}
              className="group rounded-2xl border border-red-300/10 bg-red-300/[0.03] p-5 text-left transition hover:border-red-300/25 hover:bg-red-300/[0.06]"
            >
              <p className="mb-2 text-lg">↪</p>

              <p className="font-medium text-red-200">
                Logout
              </p>

              <p className="mt-1 text-sm text-white/40">
                Sign out of your account
              </p>
            </button>
          </div>
        </section>

        {/* Security */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
            🔒
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Your information is protected
            </p>

            <p className="mt-1 text-xs text-white/40">
              Account information and saved addresses are only
              accessible to your account.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountInformation;