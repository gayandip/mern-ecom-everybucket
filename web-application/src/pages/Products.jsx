import ProductCard from "../components/ProductCard";
import Search from "../components/Search";
import { useEffect, useState, useRef } from "react";
import { useApiGet } from "../hooks/useApiGet";
import { useAppContext } from "../context/AppContext";

const Product = () => {
  const { search, setSearch, searchMode } = useAppContext();
  // Auto-search on mount if search context is set (e.g., after navigating from Home)
  useEffect(() => {
    if (search) {
      handleDirectSearch(search, searchMode || "product");
    }
  }, []);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pendingSort, setPendingSort] = useState(""); // for UI select
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearch, setLastSearch] = useState({ query: "", mode: "product" });

  // State for direct search endpoint
  const [searchApiUrl, setSearchApiUrl] = useState("");
  const { data, loading, error } = useApiGet(
    searchApiUrl || `/products/get/all?page=${page}&limit=8`
  );

  // Utility to filter and sort products
  function filterAndSortProducts(products) {
    let filtered = products;
    if (minPrice !== "" || maxPrice !== "") {
      filtered = filtered.filter((p) => {
        const price = p.priceInfo?.sellingPrice || 0;
        if (minPrice !== "" && price < Number(minPrice)) return false;
        if (maxPrice !== "" && price > Number(maxPrice)) return false;
        return true;
      });
    }
    if (sort === "Price: Low to High") {
      filtered = [...filtered].sort(
        (a, b) =>
          (a.priceInfo?.sellingPrice || 0) - (b.priceInfo?.sellingPrice || 0)
      );
    } else if (sort === "Price: High to Low") {
      filtered = [...filtered].sort(
        (a, b) =>
          (b.priceInfo?.sellingPrice || 0) - (a.priceInfo?.sellingPrice || 0)
      );
    }
    return filtered;
  }

  useEffect(() => {
    if (data && data.data.products) {
      let newProducts = [];
      if (!searchApiUrl && !isSearching && !lastSearch.query) {
        // Normal paginated fetch
        newProducts =
          page === 1
            ? data?.data.products
            : [...products, ...data?.data.products];
        setProducts(filterAndSortProducts(newProducts));
        setHasMore(data?.data.products.length === 8 && page < data.totalPages);
      } else if (searchApiUrl) {
        // Direct search fetch
        setProducts(filterAndSortProducts(data.data.products || []));
        setHasMore(false);
      }
    }
  }, [data, sort, minPrice, maxPrice, lastSearch, searchApiUrl]);

  // Reset products when sort or filters change
  useEffect(() => {
    setPage(1);
  }, [sort, minPrice, maxPrice, lastSearch]);

  const handleMore = () => {
    if (hasMore && !loading) {
      // If in direct search mode, try to fetch next page if supported
      if (searchApiUrl && lastSearch.query) {
        // Try to add &page=nextPage if not present
        let nextPage = page + 1;
        let baseUrl = searchApiUrl.split("?")[0];
        let params = new URLSearchParams(searchApiUrl.split("?")[1] || "");
        params.set("page", nextPage);
        setSearchApiUrl(baseUrl + "?" + params.toString());
        setPage(nextPage);
      } else {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSort(pendingSort);
    setMinPrice(pendingMin);
    setMaxPrice(pendingMax);
  };

  const handleDirectSearch = (query, mode = "product") => {
    setIsSearching(true);
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setPage(1);
      setSearchApiUrl("/products/get/all?page=1&limit=8");
      setLastSearch({ query: "", mode: "product" });
      setHasMore(true);
      setProducts([]);
      setTimeout(() => setIsSearching(false), 300);
      return;
    }
    setPage(1);
    setLastSearch({ query: cleanQuery, mode });
    setSearch(cleanQuery);
    let endpoint = "/products/get/all";
    if (mode === "product") {
      endpoint += `?search=${encodeURIComponent(cleanQuery)}&page=1&limit=8`;
    } else {
      endpoint += `?category=${encodeURIComponent(cleanQuery)}&page=1&limit=8`;
    }
    setSearchApiUrl(endpoint);
    setTimeout(() => setIsSearching(false), 300); // quick flag reset for UI
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
              onSubmit={handleFilterSubmit}
            >
              <select
                className="border rounded px-2 py-1 text-sm"
                value={pendingSort}
                onChange={(e) => setPendingSort(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <input
                type="number"
                placeholder="Min ₹"
                className="border rounded px-2 py-1 w-20 text-sm"
                value={pendingMin}
                onChange={(e) => setPendingMin(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max ₹"
                className="border rounded px-2 py-1 w-20 text-sm"
                value={pendingMax}
                onChange={(e) => setPendingMax(e.target.value)}
              />
              <button className="btn-green px-4 py-2 text-sm" type="submit">
                Apply
              </button>
            </form>
            {/* Search at right */}
            <div className="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 md:ml-auto">
              <Search onDirectSearch={handleDirectSearch} />
            </div>
          </div>
        </div>
        {/* Product Grid */}
      </div>
      {/* Loading indicator at top, centered, only if no products yet */}
      {(loading || isSearching) && products.length === 0 && (
        <div className="flex justify-center items-center my-8">
          <span className="text-green-600 text-lg font-semibold animate-pulse">
            Loading...
          </span>
        </div>
      )}
      <div className="card-layout">
        {products.length === 0 && !loading && !isSearching && (
          <div>No products found</div>
        )}
        {products.map((product) => (
          <ProductCard
            key={product._id}
            img={product.images[0]}
            title={product.name}
            priceInfo={product.priceInfo}
            id={product._id}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {hasMore && (
          <button
            className="btn-green px-6 py-2 rounded font-semibold"
            onClick={handleMore}
            disabled={loading || isSearching}
          >
            {loading ? "Loading..." : "More.."}
          </button>
        )}
      </div>
    </>
  );
};

export default Product;
