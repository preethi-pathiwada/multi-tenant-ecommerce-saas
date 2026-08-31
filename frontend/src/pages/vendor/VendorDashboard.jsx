import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const VendorDashboard = () => {

    const [productCount, setProductCount] = useState(0);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchProductCount = async () => {
        try {
            const response = await api.get("/products/my-store", {headers:{Authorization:`Bearer ${import.meta.env.VITE_VENDOR_JWT_TOKEN}`}});

            setProductCount(response.data.products.length);
        } 
        
        catch (error) {
            console.error(error);
        }
        };

        fetchProductCount();
    }, []);

        return (
        <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold">
            Vendor Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
            Manage your store, products and orders.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="font-semibold">
                Products
            </h2>
            <p className="mt-2 text-2xl font-bold">
                {productCount}
            </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="font-semibold">
                Orders
            </h2>
            <p className="mt-2 text-2xl font-bold">
                0
            </p>
            </div>

            <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="font-semibold">
                Revenue
            </h2>
            <p className="mt-2 text-2xl font-bold">
                ₹0
            </p>
            </div>
        </div>
        <button
            onClick={() => navigate("/vendor/products")}
            className="mt-6 rounded bg-black px-5 py-3 text-white"
            >
            Manage Products
        </button>
        <button
            onClick={() => navigate("/vendor/store")}
            className="mt-4 rounded border px-5 py-3"
            >
            My Store
        </button>
        </div>
    );
};

export default VendorDashboard;