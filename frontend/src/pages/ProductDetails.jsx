
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";
import { addToCart } from "../store/cartSlice";


const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/products/${productId}`
        );

        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (!product) {
    return <p className="p-6">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow ">
        <h1 className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="mt-4 text-xl font-semibold">
          ₹{product.price}
        </p>

        <p className="mt-3 text-gray-600">
          {product.description}
        </p>

        <p className="mt-3">
          Stock: {product.stock}
        </p>

        {product.variants?.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold">
              Available Options
            </h2>

            <div className="flex justify-center gap-3">
              {product.variants.map((variant) => (
                <div
                  key={variant._id}
                  className="rounded border p-3"
                >
                  <p className="font-medium">
                    {variant.name}
                  </p>

                  <p>₹{variant.price}</p>

                  <p className="text-sm text-gray-500">
                    Stock: {variant.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
            onClick={() => {
                dispatch(
                addToCart({
                    productId: product._id,
                    variantId: null,
                    name: product.name,
                    variantName: null,
                    price: product.price,
                })
                )
                
            }
                
            }
            className="mt-6 rounded bg-black px-6 py-3 text-white"
            >
            Add to Cart
        </button>
        <Link to={"/cart"}><button className="bg-blue-400 rounded-md px-4 py-2 text-white">Go to cart</button></Link>
      </div>
    </div>
  );
};

export default ProductDetails;