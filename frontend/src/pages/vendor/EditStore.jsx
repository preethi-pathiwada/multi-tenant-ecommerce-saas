import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const EditStore = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get("/stores/my-store", {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

        const store = response.data.store;

        setForm({
          name: store.name,
          description: store.description || "",
        });
      } catch (error) {
        console.error(error);

        alert("Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/stores/my-store", {
        name: form.name,
        description: form.description,
      }, {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

      alert("Store updated successfully");

      navigate("/vendor/store");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update store"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading store...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">
          Edit Store
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Store Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-black py-3 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStore;