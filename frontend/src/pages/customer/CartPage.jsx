import { useDispatch, useSelector } from "react-redux";
import {removeFromCart, clearCart, increaseQuantity, decreaseQuantity} from "../../redux/cartSlice"
import CustomerHeader from "./CustomerHeader";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity,0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity,0);

  const handleClearCart = () => {
    const confirmed = window.confirm("Are you sure you want to remove all items from your cart?");

    if (confirmed) {
      dispatch(clearCart());
    }
  };

  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-6 sm:px-6 lg:px-8">
        <CustomerHeader />

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-12">

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-teal-200/30 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-200/60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-11 w-11"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.086.835L5.5 6.75m0 0h14.25l-1.5 9H7.25l-1.75-9zm0 0L4.5 3M9 20.25h.008v.008H9v-.008zm8.25 0h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
                Shopping Cart
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Your cart is empty
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Looks like you haven't added anything to your cart yet.
                Start exploring and your selected products will appear here.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-7 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/70"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-teal-50/50 px-4 py-6 sm:px-6 lg:px-8">
      <CustomerHeader />

      <div className="mx-auto max-w-7xl">

        {/* --------------------------------
            PAGE HEADER
        -------------------------------- */}

        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 px-6 py-8 text-white shadow-xl shadow-cyan-200/50 sm:px-8">

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-sm">
                  🛒
                </span>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  Shopping Cart
                </p>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-white/80">
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"} ready for checkout
              </p>
            </div>

            <button
              onClick={handleClearCart}
              className="self-start rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/20 sm:self-auto"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* --------------------------------
            MAIN CONTENT
        -------------------------------- */}

        <div className="mt-7 grid gap-6 lg:grid-cols-3">

          {/* --------------------------------
              CART ITEMS
          -------------------------------- */}

          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => {
              const image = item.image || item.images?.[0] || null;

              const itemSubtotal = item.price * item.quantity;

              return (
                <div
                  key={item.cartId}
                  className="group overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-4 shadow-md shadow-slate-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/50 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">

                    {/* Product Image */}

                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-100 via-cyan-50 to-teal-50 sm:h-36 sm:w-36">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-80" />
                    </div>

                    {/* Product Details */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600">
                            Product
                          </p>

                          <h2 className="mt-1 truncate text-base font-bold text-slate-900 sm:text-lg">
                            {item.name}
                          </h2>

                          {item.variantName && (
                            <div className="mt-2 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                              Option: {item.variantName}
                            </div>
                          )}

                          <p className="mt-2 text-sm font-bold text-teal-700">
                            ₹{item.price.toLocaleString("en-IN")}
                            <span className="ml-1 font-medium text-slate-400">
                              / unit
                            </span>
                          </p>
                        </div>

                        {/* Remove */}

                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.cartId))
                          }
                          className="shrink-0 rounded-xl border border-transparent p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.7"
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12M9 7V4.5h6V7m-7.5 0l.75 12.75h7.5L16.5 7M10 10.5v6M14 10.5v6"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Bottom Row */}

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">

                        {/* Quantity */}

                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Quantity
                          </p>

                          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <button
                              onClick={() =>
                                dispatch(decreaseQuantity(item.cartId))
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg font-medium text-slate-500 transition hover:bg-teal-50 hover:text-teal-600"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-200 bg-white px-3 text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                dispatch(increaseQuantity(item.cartId))
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg font-medium text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-600"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-xl font-black text-slate-900">
                            ₹{itemSubtotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --------------------------------
              ORDER SUMMARY
          -------------------------------- */}

          <div className="lg:col-span-1">
            <div className="sticky top-6 overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">

              {/* Summary Header */}

              <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white sm:p-7">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                    Checkout
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Order Summary
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-7">

                <div className="space-y-4">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Items ({totalItems})
                    </span>

                    <span className="font-semibold text-slate-800">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Shipping
                    </span>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <span className="text-base font-bold text-slate-900">
                        Total
                      </span>

                      <span className="text-2xl font-black text-transparent bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping */}

                <div className="mt-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                      🚚
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Free shipping included
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Shipping charges are currently free on your order.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout */}

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-200/70 focus:outline-none"
                >
                  Proceed to Checkout
                  <span className="text-base">→</span>
                </button>

                {/* Continue Shopping */}

                <button
                  onClick={() => navigate("/")}
                  className="mt-3 w-full rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-3 text-sm font-bold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  Continue Shopping
                </button>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-center text-xs leading-5 text-slate-400">
                    You can review your order details before completing
                    payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom reassurance */}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/80 bg-white/65 p-4 text-center backdrop-blur-md">
            <div className="text-lg">🔒</div>
            <p className="mt-1 text-xs font-bold text-slate-700">
              Secure Checkout
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/65 p-4 text-center backdrop-blur-md">
            <div className="text-lg">⚡</div>
            <p className="mt-1 text-xs font-bold text-slate-700">
              Fast Ordering
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/65 p-4 text-center backdrop-blur-md">
            <div className="text-lg">✓</div>
            <p className="mt-1 text-xs font-bold text-slate-700">
              Easy Order Tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

