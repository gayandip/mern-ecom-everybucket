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
import ProtectedRoute from "./components/ProtectedRoute";
import SellerRoute from "./components/SellerRoute";
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
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />
          <Route path="/user">
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/store">
            <Route path="register" element={<RegisterStore />} />
            <Route
              path="my-store"
              element={
                <SellerRoute>
                  <Dashboard />
                </SellerRoute>
              }
            />
            <Route
              path="my-products"
              element={
                <SellerRoute>
                  <MyStoreProducts />
                </SellerRoute>
              }
            />
            <Route
              path="my-orders"
              element={
                <SellerRoute>
                  <StoreOrders />
                </SellerRoute>
              }
            />
            <Route
              path="list-new-product"
              element={
                <SellerRoute>
                  <ListProduct />
                </SellerRoute>
              }
            />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
