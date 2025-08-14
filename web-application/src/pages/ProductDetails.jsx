import { Link, useParams } from "react-router-dom";
import Error from "./Error";
import { useState, useEffect } from "react";
import { useApiGet } from "../hooks/useApiGet";
import StoreDetailsModal from "../components/StoreDetailsModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
function getImageUrl(img) {
  if (!img) return "";
  const path = img.startsWith("/") ? img : "/" + img;
  return BACKEND_URL + path;
}

const ProductDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useApiGet(`/products/get/${id}`);
  const [mainImg, setMainImg] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [showStoreFetch, setShowStoreFetch] = useState(false);
  const {
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useApiGet(
    showStoreFetch && storeId ? `/stores/get/details/${storeId}` : null
  );

  useEffect(() => {
    if (data?.data && data.data.images && data.data.images.length > 0) {
      setMainImg(data.data.images[0]);
    }
  }, [data]);

  const handleViewStore = () => {
    if (!data?.data || !data.data.owner) return;
    setStoreId(data.data.owner);
    setShowStoreModal(true);
    setShowStoreFetch(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error || !data?.data)
    return <Error message="Oops! product not found" statusCode={404} />;

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="flex flex-col items-center md:w-1/2">
          {mainImg ? (
            <img
              src={getImageUrl(mainImg)}
              alt={data.data.name}
              className="w-64 h-64 object-cover rounded mb-4 border"
            />
          ) : null}
          <div className="flex gap-2">
            {data.data.images &&
              data.data.images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={data.data.name + " " + (idx + 1)}
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
            <h2 className="text-2xl font-bold mb-2">{data.data.name}</h2>
            <div className="text-gray-700 mb-2">{data.data.description}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 line-through">
                ₹{data.data.priceInfo?.mrp}
              </span>
              <span className="text-blue-700 text-xl font-bold">
                ₹{data.data.priceInfo?.sellingPrice}
              </span>
            </div>
            <div className="text-gray-700 mb-2">
              Category: {data.data.category}
            </div>
            <div className="text-gray-700 mb-2">
              Warranty: {data.data.warranty}
            </div>
            {data.data.otherDetails && data.data.otherDetails.length > 0 && (
              <ul className="list-disc ml-6 text-gray-700 mb-2">
                {data.data.otherDetails.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            <Link
              to={`/order/${data.data._id}`}
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
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-white bg-opacity-60 z-40" />
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <StoreDetailsModal
              store={storeData}
              onClose={() => {
                setShowStoreModal(false);
                setStoreId(null);
                setShowStoreFetch(false);
              }}
            />
          </div>
        </>
      )}
      {storeLoading && showStoreModal && (
        <>
          <div className="fixed inset-0 bg-blue-300 bg-opacity-40 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow">
              Loading store details...
            </div>
          </div>
        </>
      )}
      {storeError && showStoreModal && (
        <>
          <div className="fixed inset-0 bg-white bg-opacity-60 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow text-red-500">
              {storeError}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
