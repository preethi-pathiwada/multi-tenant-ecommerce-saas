import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/my-orders/${id}`);
        // console.log("ID is", id);
        // console.log("Response is: ", response)
        setOrder(response.data.order);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading order...</p>;
  }

  if (!order) {
    return <p className="p-6">Order not found.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Order Details</h1>

      <div className="mb-6 rounded-lg border p-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Store:</strong> {order.store?.name}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      </div>

      <h2 className="mb-3 text-xl font-semibold">Items</h2>

      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="rounded-lg border p-4">
            <p><strong>Product:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Subtotal:</strong> ₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;