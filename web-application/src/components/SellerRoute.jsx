import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SellerRoute = ({ children }) => {
  const { login, userData, loading } = useAppContext();

  const isSeller = userData && userData.stores && userData.stores.length > 0;

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }
  if (!login) {
    return <Navigate to="/login" replace />;
  }
  if (!isSeller) {
    return <Navigate to="/user/register-store" replace />;
  }
  return children;
};

export default SellerRoute;
