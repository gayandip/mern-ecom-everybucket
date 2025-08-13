import { Link } from "react-router-dom";

import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { useApiGet } from "../../hooks/useApiGet";

const Dashboard = () => {
  const { userData } = useAppContext();

  const stores = Array.isArray(userData?.stores) ? userData.stores : [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const storeId = stores[selectedIdx]?.id;

  // Fetch store details
  const {
    data: storeDetailsData,
    loading: storeDetailsLoading,
    error: storeDetailsError,
  } = useApiGet(storeId ? `/stores/get/details/${storeId}` : null);
  const store = storeDetailsData?.data || {};

  // Fetch store stats
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useApiGet(storeId ? `/products/get/store-stats/${storeId}` : null);
  const stats = statsData || {};

  const options = [
    {
      to: "/user/register-store",
      text: "Register New Store",
      bg: "yellow",
    },
    {
      to: "/store/my-products",
      text: "Manage Products",
      bg: "blue",
    },
    {
      to: "/store/my-orders",
      text: "View Orders",
      bg: "green",
    },
    {
      to: "/seller/profile",
      text: "Edit Profile",
      bg: "yellow",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Store Dashboard
      </h2>
      {/* Store selector */}
      {stores.length > 1 && (
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {stores.map((s, idx) => (
            <button
              key={s._id || s.name}
              className={`px-4 py-2 rounded font-semibold border ${
                selectedIdx === idx
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-100 border-gray-300"
              }`}
              onClick={() => setSelectedIdx(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
      {stores.length === 0 ? (
        <div className="text-center text-gray-500">No stores found.</div>
      ) : storeDetailsLoading ? (
        <div className="text-center text-gray-500">
          Loading store details...
        </div>
      ) : storeDetailsError ? (
        <div className="text-center text-red-500">{storeDetailsError}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="avtar fle shrink-0">{store.storeName?.[0]}</div>
            <div className="flex-1">
              <div className="font-bold text-xl">{store.storeName}</div>
              <div className="text-gray-600">Owner: {store.ownerName}</div>
              <div className="text-gray-600">Phone: {store.contact?.phone}</div>
              <div className="text-gray-600">
                Address: {store.contact?.address}
              </div>
              <div className="text-gray-500 mt-1">{store.description}</div>
              <div className="text-gray-400 text-xs mt-1">
                Created:{" "}
                {store.createdAt
                  ? new Date(
                      store.createdAt.$date || store.createdAt
                    ).toLocaleString()
                  : "-"}
              </div>
              <div className="text-gray-400 text-xs">
                Updated:{" "}
                {store.updatedAt
                  ? new Date(
                      store.updatedAt.$date || store.updatedAt
                    ).toLocaleString()
                  : "-"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-blue-700">
                {statsLoading ? "..." : stats.products ?? 0}
              </div>
              <div className="text-gray-600 text-sm">Products</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-green-700">
                {statsLoading ? "..." : stats.orders ?? 0}
              </div>
              <div className="text-gray-600 text-sm">Orders</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-yellow-700">
                {statsLoading ? "..." : `₹${stats.revenue ?? 0}`}
              </div>
              <div className="text-gray-600 text-sm">Revenue</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((opt) => (
              <Link
                key={opt.to}
                to={opt.to}
                className={`bg-${opt.bg}-100  p-4 rounded-lg shadow hover:bg-${opt.bg}-200 text-center font-semibold block`}
              >
                {opt.text}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
