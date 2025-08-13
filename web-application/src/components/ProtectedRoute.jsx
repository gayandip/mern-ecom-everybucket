import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { login, loading } = useAppContext();
  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }
  if (!login) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
