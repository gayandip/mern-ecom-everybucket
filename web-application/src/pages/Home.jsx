import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Search from "../components/Search";

function Home() {
  const categories = [
    { name: "Fruits", image: "categories/cat-fruits.png" },
    { name: "Vegetables", image: "categories/cat-vegetables.png" },
    { name: "Clothes", image: "categories/cat-clothes.png" },
    { name: "Beverages", image: "categories/cat-beverages.png" },
    { name: "Dairy", image: "categories/cat-dairy.png" },
    { name: "Rice", image: "categories/cat-rice.png" },
    { name: "Snacks", image: "categories/cat-snacks.png" },
    { name: "Electronics", image: "categories/cat-electronics.png" },
    { name: "Furnitures", image: "categories/cat-furnitures.png" },
    { name: "Beauty", image: "categories/cat-beauty.png" },
  ];

  const newArrivals = [
    {
      _id: "1",
      title: "Clothes",
      price: 249,
      img: "categories/cat-clothes.png",
      url: `/product{id}`,
    },
    {
      _id: "2",
      title: "Electronics",
      price: 2999,
      img: "categories/cat-electronics.png",
      url: `/product{id}`,
    },
    {
      _id: "3",
      title: "Beauty Essentials",
      price: 299,
      img: "categories/cat-beauty.png",
      url: `/product{id}`,
    },
    {
      _id: "4",
      title: "Modern Furnitures",
      price: 1999,
      img: "categories/cat-furnitures.png",
      url: `/product{id}`,
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center ">
        <img
          src="home-banner.png"
          alt="home-banner"
          className="w-lvw md:h-120 md:object-cover"
        />
        <div>
          <h1 className="text-center text-2xl font-bold m-4 text-green-400">
            Welcome to EveryBucket, you get what you desire...
          </h1>
        </div>
      </div>

      {/* Search and Category */}
      <div className="w-full py-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-7 mb-4">
          <Search />
          <Link
            to="/products"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition whitespace-nowrap"
          >
            View All Products
          </Link>
        </div>
        <h2 className="text-lg font-semibold my-4 px-7">Shop by Category</h2>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 px-2 md:gap-6 md:px-4"
          style={{ minWidth: "300px" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="min-w-[140px] bg-green-200 rounded-lg shadow-md flex flex-col items-center p-3 hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-20 h-20 object-cover mb-2 rounded-full"
              />
              <span className="font-semibold text-md text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="w-full py-8 px-4">
        <h2 className="text-lg font-semibold my-4 px-7">New Arrivals</h2>

        <div className="card-layout">
          {newArrivals.map((obj) => (
            <ProductCard
              key={obj._id}
              img={obj.img}
              title={obj.title}
              price={obj.price}
              id={obj._id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
