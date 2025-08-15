import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../context/AppContext";

function ProductCard({ img, title, priceInfo, id }) {
  const navigate = useNavigate();
  const handleBuyNow = (e) => {
    e.preventDefault();
    navigate(`/order/${id}`);
  };
  return (
    <Link
      to={`/product/${id}`}
      className="bg-blue-50 text-center rounded-lg shadow-md p-4 flex flex-col items-center border-2 border-gray-200 hover:shadow-xl transition-shadow"
    >
      <img
        src={getImageUrl(img)}
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
      <button type="button" className="product-card-btn" onClick={handleBuyNow}>
        Buy Now
      </button>
    </Link>
  );
}

export default ProductCard;
