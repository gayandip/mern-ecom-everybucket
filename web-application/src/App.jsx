import AddAddress from "./pages/AddAddress";
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

const userRoutes = [
  { path: "add-address", element: <AddAddress /> },
  { path: "account", element: <Account /> },
  { path: "orders", element: <Orders /> },
  { path: "register-store", element: <RegisterStore /> },
];

const sellerRoutes = [
  { path: "my-store", element: <Dashboard /> },
  { path: "my-products", element: <MyStoreProducts /> },
  { path: "my-orders", element: <StoreOrders /> },
  { path: "list-new-product", element: <ListProduct /> },
];

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
            {userRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<ProtectedRoute>{element}</ProtectedRoute>}
              />
            ))}
          </Route>
          <Route path="/store">
            {sellerRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<SellerRoute>{element}</SellerRoute>}
              />
            ))}
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
