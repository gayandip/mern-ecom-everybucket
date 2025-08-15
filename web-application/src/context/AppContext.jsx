import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  // Global search/category state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [searchMode, setSearchMode] = useState("product");

  // Fetch user data (can be called to refresh after updates)
  const refreshUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/users/get/loggedin-user");
      if (res.data && res.data.data) {
        setLogin(true);
        setUserData(res.data.data);
      } else {
        setLogin(false);
        setUserData({});
      }
    } catch {
      setLogin(false);
      setUserData({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refreshUserData();
  }, []);

  const values = {
    login,
    setLogin,
    userData,
    setUserData,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    searchMode,
    setSearchMode,
    refreshUserData,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

function getImageUrl(img) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(
    /\/$/,
    ""
  ).replace(/\/api\/v1/, "");
  if (!img) return "";
  const path = img.startsWith("/") ? img : "/" + img;
  return BACKEND_URL + path;
}

export { AppContext, ContextProvider, useAppContext, getImageUrl };
