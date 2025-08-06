import React from "react";

const sampleOrders = [
  {
    id: "ORD123456",
    date: "2025-08-01",
    item: {
      name: "Apple iPhone 15",
      seller: "Apple Store",
      actualPrice: 100000,
      discount: 5000,
      totalPrice: 95000,
    },
    otherCharges: {
      shipping: 200,
      tax: 1800,
    },
    status: "Delivered",
  },
  {
    id: "ORD123457",
    date: "2025-07-20",
    item: {
      name: "Bluetooth Headphones",
      seller: "Boat Official",
      actualPrice: 4000,
      discount: 500,
      totalPrice: 3500,
    },
    otherCharges: {
      shipping: 100,
      tax: 250,
    },
    status: "processing",
  },
];

const Orders = () => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {sampleOrders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {sampleOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Order ID: {order.id}</span>
                <span className="text-sm text-gray-500">{order.date}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Product:</span>
                <div className="ml-4 text-gray-700">
                  <div className="font-semibold">{order.item.name}</div>
                  <div className="text-sm text-gray-500">
                    Seller: {order.item.seller}
                  </div>
                  <div className="text-sm">
                    Actual Price:{" "}
                    <span className="line-through text-gray-400">
                      ₹{order.item.actualPrice}
                    </span>
                  </div>
                  <div className="text-sm">
                    Discount:{" "}
                    <span className="text-green-600">
                      ₹{order.item.discount}
                    </span>
                  </div>
                  <div className="text-sm">
                    Other Charges:{" "}
                    <span className="text-gray-800">
                      ₹{order.otherCharges.shipping + order.otherCharges.tax}
                    </span>
                  </div>
                  <div className="text-sm font-bold">
                    Total Price:{" "}
                    <span className="text-blue-600">
                      ₹{order.item.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
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
