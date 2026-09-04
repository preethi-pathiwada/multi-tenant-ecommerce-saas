import { useEffect, useState } from "react";
import api from "../../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
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
    return <p className="p-6">Loading orders...</p>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (<p>You haven't placed any orders yet.</p>) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">Store: {order.store?.name}</p>
                </div>

                <div>
                  <p>Status:{" "}<span className="font-semibold">{order.status}</span></p>
                  <p>Payment:{" "}<span className="font-semibold">{order.paymentStatus}</span></p>
                </div>
              </div>

              <div className="mt-3">
                <p>Total: ₹{order.totalAmount}</p>
                <p>Items: {order.items.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;