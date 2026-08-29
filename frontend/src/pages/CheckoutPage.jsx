import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


import api from "../services/api";
import { clearCart } from "../store/cartSlice";


const loadRazorpay = () => {

  return new Promise((resolve) => {
    const script = document.createElement("script");
    
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    
    script.onload = () => {
      resolve(true);
    }
    
    script.onerror = () => {
      resolve(false);
    }
    
    document.body.appendChild(script);
  })

};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const [form, setForm] = useState({name: "", phone: "", address: "", city: "", state: "", pincode: ""});

  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const storeId = cartItems[0].store;

      const items = cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));


      const response = await api.post("/orders",
        {store: storeId, items, shippingAddress: form},
        {headers:{Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YThlYTBmMGQ1NmZmNTlmZDY2ZWE3YTEiLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3ODc3MzIyNjksImV4cCI6MTc4ODMzNzA2OX0.aky4mj01VMqmBY6w0YKUEZFeOWQQBYJBXFceGaryTsI"}}
      );
       
      console.log(response.data);

      const createdOrder = response.data.order;

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay failed to load");
        return;
      }

      const razorpayResponse = await api.post("/orders/payment/create", {orderId: "6a90632950df2f19b733f9e5"}, 
        {headers:
          {
            Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YThlYTBmMGQ1NmZmNTlmZDY2ZWE3YTEiLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3ODc3MzIyNjksImV4cCI6MTc4ODMzNzA2OX0.aky4mj01VMqmBY6w0YKUEZFeOWQQBYJBXFceGaryTsI"}})

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayResponse.data.amount,

        currency: razorpayResponse.data.currency,

        name: "Preethi's Fashion",

        description: "E-Commerce Purchase",

        order_id: razorpayResponse.data.razorpayOrderId,

        handler: function (paymentResponse) {
          console.log("Payment Response:", paymentResponse);
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: {
          color: "#000000",
        },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

      dispatch(clearCart());
      navigate("/order-success");

    } 
    
    catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } 

    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <div className="border-t pt-4">
            <p className="text-xl font-bold">
              Total: ₹{total}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black py-3 text-white"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;