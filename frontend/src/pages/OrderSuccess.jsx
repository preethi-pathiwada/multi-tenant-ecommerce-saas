import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for your purchase.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;