import ProductCard from "../components/ProductCard";
import Search from "../components/Search";

const products = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    title: "Apple iPhone 15",
    price: 95000,
    url: "/product/1",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
    title: "Bluetooth Headphones",
    price: 3500,
    url: "/product/2",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Wireless Charger",
    price: 1200,
    url: "/product/3",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Wireless Charger",
    price: 120,
    url: "/product/4",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Wireless Charger",
    price: 1100,
    url: "/product/5",
  },
];

const Product = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 mt-4">
        {/* Top Bar: Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Filters and Search: stack on mobile, row on md+ */}
          <div className="flex flex-col md:flex-row w-full gap-3">
            {/* Filters at left */}
            <form className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              <select
                className="border rounded px-2 py-1 text-sm"
                defaultValue=""
              >
                <option value="">Category</option>
                <option>All</option>
                <option>Electronics</option>
                <option>Mobiles</option>
                <option>Accessories</option>
                <option>Fashion</option>
                <option>Home</option>
                <option>Grocery</option>
              </select>

              <select
                className="border rounded px-2 py-1 text-sm"
                defaultValue=""
              >
                <option value="">Sort</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            img={product.img}
            title={product.title}
            price={product.price}
            id={product.id}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="btn-green px-6 py-2 rounded font-semibold">
          More..
        </button>
      </div>
    </>
  );
};

export default Product;
