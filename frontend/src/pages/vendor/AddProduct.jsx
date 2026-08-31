import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      }, {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

      alert("Product created successfully");

      navigate("/vendor/products");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded border p-3"
            rows="4"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded border p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black py-3 text-white"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;