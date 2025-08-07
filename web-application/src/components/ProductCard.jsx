import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ img, title, priceInfo, id }) {
  return (
    <Link
      to={`/product/${id}`}
      className="bg-indigo-100 text-center rounded-lg shadow-md p-4 flex flex-col items-center border-2 border-gray-200 hover:shadow-xl transition-shadow"
    >
      <img
        src={img}
        alt="item"
        className="w-24 h-24 object-cover mb-2 rounded"
      />
      <span className="font-semibold max-sm:text-sm text-md mb-1">{title}</span>
      <div className="mb-2">
        {priceInfo?.mrp && priceInfo?.mrp !== priceInfo?.sellingPrice && (
          <span className="text-gray-500 line-through text-sm mr-2">
            ₹{priceInfo.mrp}
          </span>
        )}
        <span className="text-blue-600 font-bold">
          ₹{priceInfo?.sellingPrice}
        </span>
      </div>
      <Link to={`/order/${id}`} className="product-card-btn">
        Buy Now
      </Link>
    </Link>
  );
}

export default ProductCard;
