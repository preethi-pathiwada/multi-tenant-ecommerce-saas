import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (!dashboard) {
    return <p className="p-6">Failed to load dashboard.</p>;
  }

  const stats = [
    {
      title: "Total Vendors",
      value: dashboard.totalVendors,
    },
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
    },
    {
      title: "Total Stores",
      value: dashboard.totalStores,
    },
    {
      title: "Total Products",
      value: dashboard.totalProducts,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
    },
    {
      title: "Total Revenue",
      value: `₹${dashboard.totalRevenue}`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Super Admin Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border p-5"
          >
            <p className="text-sm text-gray-500">
              {stat.title}
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;