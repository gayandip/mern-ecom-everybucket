import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useApiPost } from "../hooks/useApiPost";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { post, loading, error, data } = useApiPost();
  const { setLogin, setUserData, login } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (login) {
      navigate("/", { replace: true });
    }
  }, [login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      setFormError("All fields are required");
      return;
    }

    const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setFormError("Invalid Email. Ex: abc@email.com");
      return;
    }

    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setFormError("Invalid Phone. Ex: +91[6-9]xxxxxxxxx");
      return;
    }
    try {
      const res = await post("/users/register", {
        name,
        phone,
        email,
        password,
      });
      if (res && res.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setFormError("Registration failed");
    }
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Register
        </h2>
        {formError && (
          <div className="mb-4 text-red-500 text-center">{formError}</div>
        )}
        {data && data.success && (
          <div className="mb-4 text-green-600 text-center">
            Registration successful!
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="+91[6-9]xxxxxxxxx"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="abc@email.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          {loading ? "Loading..." : "Register"}
        </button>
        <div className="mt-4 text-center text-sm">
          <a href="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default Register;
