import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { login } = useAppContext();
  if (!login) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
