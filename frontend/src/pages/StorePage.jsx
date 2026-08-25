import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "../styles/globals.css"
import api from "../services/api";


const StorePage = () => {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeResponse = await api.get(`/stores/${slug}`);

        const storeData = storeResponse.data.store;

        setStore(storeData);

        const productResponse = await api.get(
          `/products/store/${storeData._id}`
        );

        // console.log(productResponse);

        setProducts(productResponse.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  if (loading) {
    return <p className="p-6">Loading store...</p>;
  }

  if (!store) {
    return <p className="p-6">Store not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">
        {store.name}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link key={product._id} className="rounded-lg bg-white p-4 shadow" to={`/product/${product._id}`}>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2 text-gray-600">₹{product.price}</p>
            <p className="mt-1 text-sm text-gray-500">Stock: {product.stock}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StorePage;