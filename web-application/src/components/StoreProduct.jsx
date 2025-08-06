import { Link } from "react-router-dom";

const StoreProduct = ({ img, name, price, stock }) => {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center bg-gray-50">
      <img
        src={img}
        alt={name}
        className="w-24 h-24 object-cover rounded mb-2"
      />
      <div className="font-semibold text-lg mb-1 text-center">{name}</div>
      <div className="text-blue-700 font-bold mb-1">₹{price}</div>
      <div className="text-gray-600 text-sm mb-2">Stock: {stock}</div>
      <div className="flex gap-2 mt-auto">
        <Link className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
          Edit
        </Link>
        <Link className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
          Delete
        </Link>
      </div>
    </div>
  );
};

export default StoreProduct;
