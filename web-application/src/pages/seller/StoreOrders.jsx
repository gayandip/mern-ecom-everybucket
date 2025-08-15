import { useApiGet } from "../../hooks/useApiGet";
import { useApiPost } from "../../hooks/useApiPost";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  "waiting-to-accept",
  "accepted",
  "processing",
  "processed",
  "delivered",
  "cancelled",
  "returned",
];

const StoreOrders = () => {
  const { storeId } = useParams();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [addCostValue, setAddCostValue] = useState({});
  const navigate = useNavigate();

  const { post } = useApiPost();

  let apiUrl = `/orders/get/store-orders/${storeId}?`;
  const urlParams = [];
  if (status) urlParams.push(`status=${encodeURIComponent(status)}`);
  urlParams.push(`page=${page}`);
  urlParams.push(`limit=6`);
  apiUrl += urlParams.join("&");

  const { data, loading, error } = useApiGet(apiUrl, [
    status,
    page,
    storeId,
    reloadKey,
  ]);

  useEffect(() => {
    if (data && data.data) {
      if (page === 1) {
        setOrders(data.data.orders);
      } else {
        setOrders((prev) => [...prev, ...data.data.orders]);
      }
      setTotal(data.data.total);
    }
  }, [data]);

  // Action handlers
  const handleCancel = async (orderID) => {
    await post("/orders/cancel-order", { orderID, seller: storeId });

    navigate(0);
  };
  const handleAccept = async (order) => {
    const amount = addCostValue[order.orderID] || 0;
    await post("/orders/accept-order", {
      seller: storeId,
      order: { id: order._id, amount },
    });
    setAddCostValue((prev) => ({ ...prev, [order.orderID]: "" }));

    navigate(0);
  };

  useEffect(() => {
    setPage(1);
  }, [reloadKey]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 mt-4">Store Orders</h2>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="font-semibold">Filter by status:</span>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {loading && <div>Loading...</div>}
      {error && (
        <div className="text-red-500">
          {typeof error === "string" ? error : error?.message || "Error"}
        </div>
      )}
      {!loading && !error && orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const showCancel = !["delivered", "cancelled", "returned"].includes(
              order.status
            );
            const showAccept = order.status === "waiting-to-accept";

            return (
              <div
                key={order.orderID}
                className="border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">
                    ID: {order.orderID}
                  </div>
                  <div className="text-gray-700">
                    Customer: {order.buyer?.name}
                  </div>
                  <div className="text-gray-700">
                    Phone: {order.buyer?.phoneNumber}
                  </div>
                  <div className="text-gray-700">
                    Email: {order.buyer?.email}
                  </div>
                  <div className="text-gray-700">
                    Product: {order.product?.name}
                  </div>
                  <div className="text-gray-700">
                    Price: ₹{order.product?.price}
                  </div>
                  <div className="text-gray-700">
                    Quantity: {order.product?.quantity}
                  </div>
                  <div className="text-gray-700">
                    Others: ₹{order.price?.others || 0}
                  </div>
                  <div className="text-blue-700 font-bold">
                    Total: ₹{order.price?.grandTotal}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-start md:items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "waiting-to-accept"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "accepted"
                        ? "bg-lime-100 text-lime-700"
                        : order.status === "processing" ||
                          order.status === "processed"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {showCancel && (
                      <button
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200"
                        onClick={() => handleCancel(order.orderID)}
                      >
                        Cancel
                      </button>
                    )}
                    {showAccept && (
                      <form
                        className="flex gap-2 items-center"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAccept(order);
                        }}
                      >
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-20"
                          placeholder="amount"
                          value={addCostValue[order.orderID] || ""}
                          onChange={(e) =>
                            setAddCostValue((prev) => ({
                              ...prev,
                              [order.orderID]: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="submit"
                          className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold hover:bg-green-200"
                        >
                          Accept
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Pagination */}
      {!loading && orders.length < total && (
        <div className="flex justify-center mt-6">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default StoreOrders;
