import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});

  const values = {
    login,
    setLogin,
    userData,
    setUserData,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);

export { AppContext, ContextProvider, useAppContext };
