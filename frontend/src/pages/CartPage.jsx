import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart,increaseQuantity, decreaseQuantity} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  console.log(cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Your Cart
        </h1>

        <p className="mt-4 text-gray-600">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Your Cart
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.cartId}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <div>
              <h2 className="font-semibold">
                {item.name}
              </h2>

              {item.variantName && (
                <p className="text-sm text-gray-500">
                  {item.variantName}
                </p>
              )}

              <p className="mt-1">
                ₹{item.price}
              </p>

                <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={() =>
                        dispatch(decreaseQuantity(item.cartId))
                        }
                        className="rounded border px-3 py-1"
                    >
                        −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                        onClick={() =>
                        dispatch(increaseQuantity(item.cartId))
                        }
                        className="rounded border px-3 py-1"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
              onClick={() =>
                dispatch(removeFromCart(item.cartId))
              }
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-white p-5 shadow">
        <h2 className="text-xl font-bold">
          Total: ₹{total}
        </h2>

        <button
          onClick={() => dispatch(clearCart())}
          className="mt-4 rounded bg-black px-5 py-2 text-white"
        >
          Clear Cart
        </button>
        <button
          onClick={() => navigate("/checkout")}
          className="mt-4 w-full rounded bg-black px-5 py-3 text-white"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;