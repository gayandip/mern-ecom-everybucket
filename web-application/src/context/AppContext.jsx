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

  useEffect(() => {
    async function checkSession() {
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
    }
    checkSession();
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
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppContext, ContextProvider, useAppContext };
