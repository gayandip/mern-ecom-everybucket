import { Link, useParams } from "react-router-dom";
import StoreProduct from "../../components/StoreProduct";
import { useApiGet } from "../../hooks/useApiGet";

const MyStoreProducts = () => {
  const { storeId } = useParams();

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
        <Link
          to={`/store/list-new-product/${storeId}`}
          className="btn-green px-4 py-2"
        >
          + Add Product
        </Link>
      </div>
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
            stock={product.stocks}
          />
        ))}
      </div>
    </>
  );
};

export default MyStoreProducts;
