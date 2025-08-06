import React, { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setPassword("");
    // Simulate registration request
    setTimeout(() => {
      setLoading(false);
      // Example: setError("Registration failed.");
    }, 1500);
    // Uncomment and use actual registration logic here
    // try {
    //   await registerApi({ name, phone, email, password });
    //   setLoading(false);
    // } catch (err) {
    //   setError("Registration failed");
    //   setLoading(false);
    // }
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
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
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
