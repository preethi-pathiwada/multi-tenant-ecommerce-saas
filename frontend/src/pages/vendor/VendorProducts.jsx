import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const VendorProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/my-store", {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`, {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              My Products
            </h1>

            <p className="mt-1 text-gray-600">
              Manage products in your store.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/vendor/products/new")
            }
            className="rounded bg-black px-5 py-3 text-white"
          >
            Add Product
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {products.length === 0 ? (
            <div className="rounded bg-white p-6 shadow">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between rounded bg-white p-5 shadow"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {product.name}
                  </h2>

                  <p className="text-gray-600">
                    ₹{product.price}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/vendor/products/edit/${product._id}`
                      )
                    }
                    className="rounded border px-4 py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="rounded bg-red-600 px-4 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;