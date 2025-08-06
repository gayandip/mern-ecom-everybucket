import { Link, useParams } from "react-router-dom";
import Error from "./Error";
import { useState } from "react";

// Example product data array (in real app, fetch from API)
const products = [
  {
    id: "1",
    name: "Apple iPhone 15",
    price: 95000,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    ],
    details:
      "The latest iPhone 15 with advanced features, improved camera, and long-lasting battery.",
    store: {
      name: "Apple Store",
      address: "123 Main St, Delhi",
      phone: "+91 9876543210",
      description: "Official Apple retailer. Best deals on all Apple products.",
    },
  },
  {
    id: "2",
    name: "Bluetooth Headphones",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
    ],
    details: "High quality wireless headphones with noise cancellation.",
    store: {
      name: "Boat Official",
      address: "456 Market Rd, Mumbai",
      phone: "+91 9123456780",
      description: "Best audio gadgets and accessories.",
    },
  },
];

const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);
  const [mainImg, setMainImg] = useState(product ? product.images[0] : "");

  if (!product) {
    return <Error message="Oops! product not found" statusCode={404} />;
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col items-center md:w-1/2">
          <img
            src={mainImg}
            alt={product.name}
            className="w-64 h-64 object-cover rounded mb-4 border"
          />
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name + " " + (idx + 1)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  mainImg === img ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="text-blue-700 text-xl font-bold mb-2">
              ₹{product.price}
            </div>
            <div className="text-gray-700 mb-4">{product.details}</div>
            <Link
              to={`/order/${product.id}`}
              className="btn-green px-6 py-2 font-semibold rounded text-lg"
            >
              Buy Now
            </Link>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Store Information</h3>
            <div className="font-semibold">{product.store.name}</div>
            <div className="text-gray-600">{product.store.address}</div>
            <div className="text-gray-600">Phone: {product.store.phone}</div>
            <div className="text-gray-500 mt-1">
              {product.store.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
