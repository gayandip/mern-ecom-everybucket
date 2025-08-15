import { useApiGet } from "../../hooks/useApiGet";
import { useApiPost } from "../../hooks/useApiPost";
import { useState } from "react";
import { toast } from "react-toastify";

const Orders = () => {
  const [refresh, setRefresh] = useState(0);
  const { data, loading, error } = useApiGet(
    "/orders/get/user-orders?" + refresh
  );
  const { post: cancelPost, loading: cancelLoading } = useApiPost();
  const { post: finalizePost, loading: finalizeLoading } = useApiPost();
  const handleFinalize = async (orderID) => {
    const res = await finalizePost("/orders/finalize-order", { orderID });
    if (res && res.success) {
      toast.success("Order finalized and moved to processing");
      setRefresh((r) => r + 1);
    } else {
      toast.error(res?.message || "Failed to finalize order");
    }
  };
  const orders = data?.data || [];

  const handleCancel = async (orderID) => {
    const res = await cancelPost("/orders/cancel-order", { orderID });
    if (res && res.success) {
      toast.success("Order cancelled successfully");
      setRefresh((r) => r + 1);
    } else {
      toast.error(res?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.orderID}
              className="border rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Order ID: {order.orderID}</span>
                <span className="text-sm text-gray-500">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Product:</span>
                <div className="ml-4 text-gray-700">
                  <div className="font-semibold">{order.product?.name}</div>
                  <div className="text-sm text-gray-500">
                    Quantity: {order.product?.quantity}
                  </div>
                  <div className="text-sm">
                    Price per item:{" "}
                    <span className="text-gray-800">
                      ₹{order.product?.price}
                    </span>
                  </div>

                  <div className="text-sm">
                    Subtotal:{" "}
                    <span className="text-gray-800">
                      ₹{order.price?.sumTotal}
                    </span>
                  </div>
                  <div className="text-sm">
                    Other Charges:{" "}
                    <span className="text-gray-800">
                      ₹{order.price?.others}
                    </span>
                  </div>
                  <div className="text-sm font-bold">
                    Grand Total:{" "}
                    <span className="text-blue-600">
                      ₹{order.price?.grandTotal}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                {!["delivered", "cancelled", "returned"].includes(
                  order.status
                ) && (
                  <div className="flex items-center justify-around">
                    {order.status === "accepted" && (
                      <button
                        className="ml-2 px-3 py-1 rounded bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-60"
                        onClick={() => handleFinalize(order.orderID)}
                        disabled={finalizeLoading}
                      >
                        {finalizeLoading ? "Finalizing..." : "Finalize"}
                      </button>
                    )}
                    <button
                      className="ml-2 px-3 py-1 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                      onClick={() => handleCancel(order.orderID)}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
