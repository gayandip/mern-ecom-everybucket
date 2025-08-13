import { Link } from "react-router-dom";

const StoreProduct = ({ img, name, price, stock, mrp }) => {
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col items-center bg-gray-50">
      <div className="w-24 aspect-square overflow-hidden rounded mb-2 flex items-center justify-center">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="font-semibold text-lg mb-1 text-center">{name}</div>
      <div className="mb-1">
        <span className="text-gray-500 line-through text-sm mr-2">₹{mrp}</span>
        <span className="text-blue-700 font-bold">₹{price}</span>
      </div>
      <div className="text-gray-600 text-sm mb-1">Stock: {stock}</div>
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
