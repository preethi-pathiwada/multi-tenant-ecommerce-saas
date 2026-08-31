import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


const MyStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores/my-store", {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

        setStore(response.data.store);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return <div className="p-6">Loading store...</div>;
  }

  if (!store) {
    return <div className="p-6">Store not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">
          My Store
        </h1>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">
              Store Name
            </p>

            <p className="text-lg font-semibold">
              {store.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Store Slug
            </p>

            <p className="text-lg">
              {store.slug}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="text-lg">
              {store.description || "No description"}
            </p>
          </div>
          <button
            onClick={() => navigate("/vendor/store/edit")}
            className="mt-6 rounded bg-black px-5 py-3 text-white"
            >
            Edit Store
        </button>
        </div>
      </div>
    </div>
  );
};

export default MyStore;