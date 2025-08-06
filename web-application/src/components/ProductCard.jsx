import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ img, title, price, id }) {
  return (
    <Link
      to={`/product/${id}`}
      className="bg-indigo-100 text-center rounded-lg shadow-md p-4 flex flex-col items-center border-2 border-gray-200 hover:shadow-xl transition-shadow"
    >
      <img
        src={img}
        alt="New Arrival 1"
        className="w-24 h-24 object-cover mb-2 rounded"
      />
      <span className="font-semibold max-sm:text-sm text-md mb-1">{title}</span>
      <span className="text-blue-600 font-bold">₹{price}</span>
      <Link to={`/order/${id}`} className="product-card-btn">
        Buy Now
      </Link>
    </Link>
  );
}

export default ProductCard;
