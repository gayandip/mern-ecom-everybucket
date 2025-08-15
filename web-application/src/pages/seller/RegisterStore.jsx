import React from "react";
import { useNavigate } from "react-router-dom";
import { useApiPost } from "../../hooks/useApiPost";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";

const RegisterStore = () => {
  const [form, setForm] = React.useState({
    storeName: "",
    ownerName: "",
    description: "",
    phone: "",
    address: "",
  });
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const { post, loading } = useApiPost();
  const { refreshUserData } = useAppContext();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!form.storeName || !form.ownerName || !form.phone || !form.address) {
      setError("Please fill all required fields.");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      setError("Invalid Phone. Ex: +91[6-9]xxxxxxxxx");
      return;
    }
    try {
      const res = await post("/stores/create", form);
      if (res && res.success) {
        toast.success("Store registered successfully!");
        setForm({
          storeName: "",
          ownerName: "",
          description: "",
          phone: "",
          address: "",
        });
        if (typeof refreshUserData === "function") {
          await refreshUserData();
        }
        navigate("/store/my-store");
      } else {
        setError(res?.message);
        toast.error(res?.message || "Failed to register store");
      }
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full lg:max-w-lg md:max-w-md max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Register Store
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="storeName">
            Store Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="ownerName">
            Owner Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="phone">
            Phone
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold" htmlFor="address">
            Address
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="btn-green w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Store"}
        </button>
      </form>
    </div>
  );
};

export default RegisterStore;
