import { useApiGet } from "../../hooks/useApiGet";

const Orders = () => {
  const { data, loading, error } = useApiGet("/api/order/get/user-orders");
  const orders = data?.orders || [];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
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
                    Delivery:{" "}
                    <span className="text-gray-800">
                      {order.product?.delivery ? "Yes" : "No"}
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
              <div className="flex justify-end items-center mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
