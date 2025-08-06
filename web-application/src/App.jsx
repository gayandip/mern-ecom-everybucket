import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/user/Account";
import Orders from "./pages/user/Orders";
import RegisterStore from "./pages/seller/RegisterStore";
import Dashboard from "./pages/seller/Dashboard";
import Products from "./pages/Products";
import MyStoreProducts from "./pages/seller/MyStoreProducts";
import StoreOrders from "./pages/seller/StoreOrders";
import ProductDetails from "./pages/ProductDetails";
import PlaceOrder from "./pages/PlaceOrder";
import ListProduct from "./pages/seller/ListProduct";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow boundary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order/:id" element={<PlaceOrder />} />
          <Route path="/user">
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/store">
            <Route path="register" element={<RegisterStore />} />
            <Route path="my-store" element={<Dashboard />} />
            <Route path="my-products" element={<MyStoreProducts />} />
            <Route path="my-orders" element={<StoreOrders />} />
            <Route path="list-new-product" element={<ListProduct />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
