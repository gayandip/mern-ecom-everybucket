import { Link } from "react-router-dom";
import StoreProduct from "../../components/StoreProduct";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import { useApiGet } from "../../hooks/useApiGet";

const MyStoreProducts = () => {
  const { userData } = useAppContext();
  const stores = Array.isArray(userData?.stores) ? userData.stores : [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const storeId = stores[selectedIdx]?.id;

  const {
    data: productsData,
    loading,
    error,
  } = useApiGet(storeId ? `/products/get/all/from-store/${storeId}` : null);
  const products = productsData?.data || [];

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold">My Store Products</h2>
        <Link to={"/store/list-new-product"} className="btn-green px-4 py-2">
          + Add Product
        </Link>
      </div>
      {stores.length > 1 && (
        <div className="flex gap-2 mb-4">
          {stores.map((s, idx) => (
            <button
              key={s._id || s.name}
              className={`px-3 py-1 rounded font-semibold border ${
                selectedIdx === idx
                  ? "bg-green-200 border-green-500"
                  : "bg-gray-100 border-gray-300"
              }`}
              onClick={() => setSelectedIdx(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
      <div className="card-layout">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div>No products found.</div>
        )}
        {products.map((product) => (
          <StoreProduct
            key={product._id}
            img={product.images?.[0]}
            name={product.name}
            price={product.priceInfo?.sellingPrice}
            mrp={product.priceInfo?.mrp}
            stock={product.stock}
          />
        ))}
      </div>
    </>
  );
};

export default MyStoreProducts;
