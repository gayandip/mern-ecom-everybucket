import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SellerRoute = ({ children }) => {
  const { login, userData } = useAppContext();

  const isSeller = userData && userData.stores && userData.stores.length > 0;

  if (!login) {
    return <Navigate to="/login" replace />;
  }
  if (!isSeller) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default SellerRoute;
