import { useEffect, useState } from "react";
import api from "../../services/api";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(
          "/orders/vendor"
        );

        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="mt-1 text-gray-600">
          Orders placed in your store.
        </p>

        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="rounded bg-white p-6 shadow">
              No orders yet.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="rounded bg-white p-5 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      Order ID
                    </p>

                    <p className="text-sm text-gray-500">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">
                      Status
                    </p>

                    <p>{order.status}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p>
                    Customer:{" "}
                    {order.customer?.name}
                  </p>

                  <p>
                    Total: ₹{order.totalAmount}
                  </p>

                  <p>
                    Payment:{" "}
                    {order.paymentStatus}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold">
                    Items
                  </p>

                  {order.items.map((item) => (
                    <p
                      key={item._id}
                      className="text-gray-600"
                    >
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;