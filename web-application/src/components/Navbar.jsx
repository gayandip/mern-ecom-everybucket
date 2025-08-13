import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useApiPost } from "../hooks/useApiPost";
const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { login, setLogin, userData, setUserData } = useAppContext();
  const { post: postApi } = useApiPost();
  const currentPath = window.location.pathname;
  const items = [
    { text: "Home", path: "/" },
    { text: "Account", path: "/user/account" },
    { text: "Orders", path: "/user/orders" },
    { text: "My Store", path: "/store/my-store" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to="/">
        <h1 className="logo">Every Bucket</h1>
      </Link>

      <div className="hidden sm:flex items-center gap-8">
        {items.map((obj) => (
          <NavLink
            key={obj.text}
            onClick={() => setOpen(false)}
            to={obj.path}
            className={({ isActive }) =>
              isActive ? "text-green-600 font-semibold" : "hover:text-blue-600"
            }
          >
            {obj.text}
          </NavLink>
        ))}

        {login ? (
          <div className="relative">
            <button
              className="btn"
              onClick={async () => {
                try {
                  await postApi("/users/logout");
                  setLogin(false);
                  setUserData({});
                  navigate("/");
                } catch (err) {}
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {currentPath !== "/login" && (
              <button onClick={() => navigate("/login")} className="btn">
                Login
              </button>
            )}
            {currentPath !== "/register" && (
              <button onClick={() => navigate("/register")} className="btn">
                Register
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <button
        className="md:hidden flex items-center px-3 py-2 text-green-600 border-gray-400"
        onClick={() => setOpen(!open)}
      >
        <svg
          className="fill-current h-4 w-4"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        {items.map((obj) => (
          <NavLink
            key={obj.text}
            onClick={() => setOpen(false)}
            to={obj.path}
            className={({ isActive }) =>
              isActive ? "text-green-600 font-bold py-1" : "py-1"
            }
          >
            {obj.text}
          </NavLink>
        ))}

        {login ? (
          <div className="btn">
            <button
              onClick={async () => {
                setOpen(false);
                try {
                  await postApi("/users/logout");
                  setLogin(false);
                  setUserData({});
                  navigate("/");
                } catch (err) {}
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {currentPath !== "/login" && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="btn"
              >
                Login
              </button>
            )}
            {currentPath !== "/register" && (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/register");
                }}
                className="btn"
              >
                Register
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
