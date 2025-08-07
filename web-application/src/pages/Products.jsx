import ProductCard from "../components/ProductCard";
import Search from "../components/Search";
import { useEffect, useState } from "react";
import useApiGet from "../hooks/useApiGet";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [sort, setSort] = useState("");
  const { data, loading, error } = useApiGet(
    `/api/product/get/all?page=${page}&limit=8`
  );

  useEffect(() => {
    if (data && data.products) {
      let newProducts = [];
      if (page === 1) {
        newProducts = data.products;
      } else {
        newProducts = [...products, ...data.products];
      }
      // Apply sort after data is fetched
      if (sort === "Price: Low to High") {
        newProducts = [...newProducts].sort(
          (a, b) =>
            (a.priceInfo?.sellingPrice || 0) - (b.priceInfo?.sellingPrice || 0)
        );
      } else if (sort === "Price: High to Low") {
        newProducts = [...newProducts].sort(
          (a, b) =>
            (b.priceInfo?.sellingPrice || 0) - (a.priceInfo?.sellingPrice || 0)
        );
      }
      setProducts(newProducts);
      setHasMore(page < data.totalPages);
    }
  }, [data, page, sort]);

  const handleMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 mt-4">
        {/* Top Bar: Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row w-full gap-3">
            {/* Filters at left */}
            <form
              className="flex flex-wrap gap-2 items-center w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <select
                className="border rounded px-2 py-1 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <input
                type="number"
                placeholder="Min ₹"
                className="border rounded px-2 py-1 w-20 text-sm"
              />
              <input
                type="number"
                placeholder="Max ₹"
                className="border rounded px-2 py-1 w-20 text-sm"
              />
              <button className="btn-green px-4 py-2 text-sm">Apply</button>
            </form>
            {/* Search at right */}
            <div className="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 md:ml-auto">
              <Search />
            </div>
          </div>
        </div>
        {/* Product Grid */}
      </div>
      <div className="card-layout">
        {products.length === 0 && !loading && <div>No products found</div>}
        {products.map((product) => (
          <ProductCard
            key={product._id}
            img={product.images[0]}
            title={product.name}
            priceInfo={product.priceInfo}
            id={product._id}
          />
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <div className="flex justify-center mt-6">
        {hasMore && (
          <button
            className="btn-green px-6 py-2 rounded font-semibold"
            onClick={handleMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "More.."}
          </button>
        )}
      </div>
    </>
  );
};

export default Product;
