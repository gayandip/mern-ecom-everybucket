import { useState } from "react";

const PlaceOrder = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    street: "",
    landmark: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (
        !form.name ||
        !form.phone ||
        !form.city ||
        !form.street ||
        !form.pincode
      ) {
        setError("Please fill all required fields.");
      } else {
        alert("Order placed successfully!");
        setForm({
          name: "",
          phone: "",
          city: "",
          street: "",
          landmark: "",
          pincode: "",
        });
      }
    }, 1200);
  };

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order/Product Summary */}
      <div className="bg-white max-w-md max-h-fit rounded-lg p-6 flex-1 flex flex-col justify-between md:mb-0 border-1 border-b-green-800">
        <h3 className="text-xl font-bold mb-4 text-green-700">Order Summary</h3>

        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80"
            alt="Product"
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <div className="font-semibold">Apple iPhone 15</div>
            <div className="text-gray-600 text-sm">Qty: 1</div>
            <div className="text-blue-700 font-bold">₹95,000</div>
          </div>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹95,000</span>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Others</span>
          <span>₹200</span>
        </div>
        <div className="mb-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹95,200</span>
        </div>
      </div>

      {/* Address/Order Form */}
      <form
        className="bg-white p-8 rounded-lg w-full max-w-md flex-1 border-green-700 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Delivery Details
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="street">
            Street
          </label>
          <input
            type="text"
            id="street"
            name="street"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="landmark">
            Landmark
          </label>
          <input
            type="text"
            id="landmark"
            name="landmark"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.landmark}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold" htmlFor="pincode">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={form.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-green w-full disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
