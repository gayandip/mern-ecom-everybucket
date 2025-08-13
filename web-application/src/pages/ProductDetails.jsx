import { Link, useParams } from "react-router-dom";
import Error from "./Error";
import { useState, useEffect } from "react";
import { useApiGet } from "../hooks/useApiGet";
import StoreDetailsModal from "../components/StoreDetailsModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
function getImageUrl(img) {
  if (!img) return "";
  if (/^https?:\/\//.test(img)) return img;
  // Remove leading slash if present
  const path = img.startsWith("/") ? img : "/" + img;
  // Remove /api/v1 if present in BACKEND_URL
  const base = BACKEND_URL.replace(/\/api\/v1$/, "");
  return base + path;
}

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useApiGet(`/api/product/get/${id}`);
  const [mainImg, setMainImg] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState(null);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImg(product.images[0]);
    }
  }, [product]);

  const handleViewStore = async () => {
    if (!product || !product.owner) return;
    setStoreLoading(true);
    setStoreError(null);
    setShowStoreModal(true);
    try {
      const res = await fetch(`/api/store/get/details/${product.owner}`);
      if (!res.ok) throw new Error("Failed to fetch store details");
      const data = await res.json();
      setStoreData(data);
    } catch (err) {
      setStoreError(err.message);
    } finally {
      setStoreLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !product)
    return <Error message="Oops! product not found" statusCode={404} />;

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col items-center md:w-1/2">
          <img
            src={getImageUrl(mainImg)}
            alt={product.name}
            className="w-64 h-64 object-cover rounded mb-4 border"
          />
          <div className="flex gap-2">
            {product.images &&
              product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
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
            <div className="text-gray-700 mb-2">{product.description}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 line-through">
                ₹{product.priceInfo?.mrp}
              </span>
              <span className="text-blue-700 text-xl font-bold">
                ₹{product.priceInfo?.sellingPrice}
              </span>
            </div>
            <div className="text-gray-700 mb-2">
              Category: {product.category}
            </div>
            <div className="text-gray-700 mb-2">
              Warranty: {product.warranty}
            </div>
            {product.otherDetails && product.otherDetails.length > 0 && (
              <ul className="list-disc ml-6 text-gray-700 mb-2">
                {product.otherDetails.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            <Link
              to={`/order/${product._id}`}
              className="btn-green px-6 py-2 font-semibold rounded text-lg mr-4"
            >
              Buy Now
            </Link>
            <button
              className="btn-blue px-6 py-2 font-semibold rounded text-lg"
              onClick={handleViewStore}
            >
              View Store Details
            </button>
          </div>
        </div>
      </div>
      {/* Store Details Modal */}
      {showStoreModal && (
        <StoreDetailsModal
          store={storeData}
          onClose={() => {
            setShowStoreModal(false);
            setStoreData(null);
          }}
        />
      )}
      {storeLoading && showStoreModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            Loading store details...
          </div>
        </div>
      )}
      {storeError && showStoreModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow text-red-500">
            {storeError}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
