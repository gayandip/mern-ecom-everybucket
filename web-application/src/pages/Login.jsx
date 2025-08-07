import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useApiPost } from "../hooks/useApiPost";

function Login() {
  const [uniqueID, setUniqueID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, setLogin, setUserData } = useAppContext();
  const navigate = useNavigate();
  const { post, loading, error: apiError, data } = useApiPost();

  useEffect(() => {
    if (login) {
      navigate("/", { replace: true });
    }
  }, [login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueID || !password) {
      setError("Please enter email/phone and password.");
      return;
    }
    setError("");
    setPassword("");
    try {
      const res = await post("/users/login", { uniqueID, password });
      if (res && res.success) {
        setLogin(true);
        setUserData(res.user || {});
        navigate("/");
      } else if (res && res.message) {
        setError(res.message);
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Login
        </h2>
        {(error || apiError) && (
          <div className="mb-4 text-red-500 text-center">
            {error || apiError}
          </div>
        )}
        {data && data.success && (
          <div className="mb-4 text-green-600 text-center">
            Login successful!
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="uniqueID">
            Email or Phone
          </label>
          <input
            type="text"
            id="uniqueID"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={uniqueID}
            onChange={(e) => setUniqueID(e.target.value)}
            required
            placeholder="email or +91[6-9]XXXXXXXXX"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-green w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <div className="mt-4 text-center text-sm">
          <a href="/register" className="text-blue-500 hover:underline">
            Don't have an account? Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
