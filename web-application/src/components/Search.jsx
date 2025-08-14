import { useAppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

const Search = ({ onDirectSearch }) => {
  const { search, setSearch, searchMode, setSearchMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (onDirectSearch) {
      onDirectSearch(trimmed, searchMode);
    } else {
      setSearch(trimmed);
      // If not already on /products, navigate there
      if (location.pathname !== "/products") {
        navigate("/products");
      }
    }
  };

  return (
    <form className="flex w-full md:w-2/3 gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={
          searchMode === "product"
            ? "Search products..."
            : "Search categories..."
        }
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <label className="flex items-center text-sm">
          <input
            type="radio"
            name="searchMode"
            value="product"
            checked={searchMode === "product"}
            onChange={() => setSearchMode("product")}
            className="mr-1"
          />
          Product
        </label>
        <label className="flex items-center text-sm">
          <input
            type="radio"
            name="searchMode"
            value="category"
            checked={searchMode === "category"}
            onChange={() => setSearchMode("category")}
            className="mr-1"
          />
          Category
        </label>
      </div>
      <button className="btn-green" type="submit">
        Search
      </button>
    </form>
  );
};

export default Search;
