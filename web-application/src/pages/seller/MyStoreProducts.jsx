import { Link } from "react-router-dom";
import StoreProduct from "../../components/StoreProduct";
const products = [
  {
    id: 1,
    name: "Apple iPhone 15",
    price: 95000,
    listed: true,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Bluetooth Headphones",
    price: 3500,
    listed: false,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Wireless Charger",
    price: 1200,
    listed: true,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

const MyStoreProducts = () => {
  return (
    <>
      <div className="flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold">My Store Products</h2>
        <Link to={"/store/list-new-product"} className="btn-green px-4 py-2">
          + Add Product
        </Link>
      </div>
      <div className="card-layout">
        {products.map((product) => (
          <StoreProduct
            key={product.id}
            img={product.image}
            name={product.name}
            price={product.price}
            stock={product.stock}
          />
        ))}
      </div>
    </>
  );
};

export default MyStoreProducts;
