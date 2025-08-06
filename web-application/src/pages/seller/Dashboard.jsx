import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const store = {
    name: "FreshMart",
    owner: "Amit Kumar",
    phone: "+91 9876543210",
    address: "123 Main St, Delhi",
    description: "Best quality groceries and daily needs.",
    stats: {
      products: 12,
      orders: 34,
      revenue: 56000,
    },
  };

  const options = [
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
      <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
        <div className="avtar fle shrink-0">{store.name[0]}</div>
        <div className="flex-1">
          <div className="font-bold text-xl">{store.name}</div>
          <div className="text-gray-600">Owner: {store.owner}</div>
          <div className="text-gray-600">Phone: {store.phone}</div>
          <div className="text-gray-600">Address: {store.address}</div>
          <div className="text-gray-500 mt-1">{store.description}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-blue-700">
            {store.stats.products}
          </div>
          <div className="text-gray-600 text-sm">Products</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-green-700">
            {store.stats.orders}
          </div>
          <div className="text-gray-600 text-sm">Orders</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="text-lg font-bold text-yellow-700">
            ₹{store.stats.revenue}
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
    </div>
  );
};

export default Dashboard;
