import React from "react";

const orders = [
  {
    id: "ORD1001",
    customer: "Rahul Sharma",
    product: "Apple iPhone 15",
    quantity: 1,
    total: 95000,
    status: "Pending",
  },
  {
    id: "ORD1002",
    customer: "Priya Singh",
    product: "Bluetooth Headphones",
    quantity: 2,
    total: 7000,
    status: "Accepted",
  },
  {
    id: "ORD1003",
    customer: "Amit Kumar",
    product: "Wireless Charger",
    quantity: 1,
    total: 1200,
    status: "Pending",
  },
];

const StoreOrders = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Store Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex-1">
              <div className="font-semibold text-lg mb-1">ID: {order.id}</div>
              <div className="text-gray-700">Customer: {order.customer}</div>
              <div className="text-gray-700">Product: {order.product}</div>
              <div className="text-gray-700">Price: {order?.price}</div>
              <div className="text-gray-700">Quantity: {order.quantity}</div>
              <div className="text-gray-700">Others: {order?.other || 0}</div>
              <div className="text-blue-700 font-bold">
                Total: ₹{order.total}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start md:items-end">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                  order.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
              <div className="flex gap-2">
                <button className="btn-green font-semibold">Accept</button>
                <button className="btn font-semibold">Add Cost</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StoreOrders;
