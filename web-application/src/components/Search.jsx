import { useState } from "react";
import { Link } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="flex w-full md:w-2/3 gap-2">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
        />
        <Link
          to={`/products:${search.toLowerCase()}`}
          className="btn-green"
          type="submit"
        >
          Search
        </Link>
      </div>
    </>
  );
};

export default Search;
