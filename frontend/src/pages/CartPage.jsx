import { useDispatch, useSelector } from "react-redux";
import {removeFromCart, clearCart, increaseQuantity, decreaseQuantity} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (confirmed) {
      dispatch(clearCart());
    }
  };

  // --------------------------------
  // EMPTY CART
  // --------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-9 w-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.086.835L5.5 6.75m0 0h14.25l-1.5 9H7.25l-1.75-9zm0 0L4.5 3M9 20.25h.008v.008H9v-.008zm8.25 0h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Looks like you haven't added anything to your cart yet.
              Start shopping and your selected products will appear here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-7 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-600">
              Shopping Cart
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <button
            onClick={handleClearCart}
            className="self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto"
          >
            Clear Cart
          </button>
        </div>

        {/* --------------------------------
            MAIN CONTENT
        -------------------------------- */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

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
                  className="rounded-3xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">

                    {/* Product Image */}

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-32">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-8 w-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5l4.5-4.5a2.121 2.121 0 013 0l1.5 1.5m0 0l1.5-1.5a2.121 2.121 0 013 0L21 16.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                            {item.name}
                          </h2>

                          {item.variantName && (
                            <p className="mt-1 text-sm text-gray-500">
                              Variant: {item.variantName}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-medium text-teal-700">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* Remove */}

                        <button
                          onClick={() =>
                            dispatch(
                              removeFromCart(item.cartId)
                            )
                          }
                          className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
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
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                            Quantity
                          </p>

                          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                            <button
                              onClick={() =>
                                dispatch(
                                  decreaseQuantity(
                                    item.cartId
                                  )
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-white hover:text-teal-600"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 bg-white px-3 text-sm font-semibold text-gray-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                dispatch(
                                  increaseQuantity(
                                    item.cartId
                                  )
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-white hover:text-teal-600"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>

                          </div>
                        </div>

                        {/* Item Subtotal */}

                        <div className="text-right">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-lg font-semibold text-gray-900">
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
            <div className="sticky top-6 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Items ({totalItems})
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-teal-600">
                    Free
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-semibold text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Message */}

              <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 text-teal-600">
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
                        d="M3.75 13.5h10.5m0 0l-3-3m3 3l-3 3M15.75 6.75h2.25l2.25 3v5.25h-4.5V6.75zM6.75 17.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm12 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Free shipping
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Shipping charges are currently free.
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout */}

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}

              <button
                onClick={() => navigate("/")}
                className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </button>

              <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                You can review your order details before completing
                payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
