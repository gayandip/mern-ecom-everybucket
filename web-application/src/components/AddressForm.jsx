import { useState } from "react";

const AddressForm = ({ onSubmit, loading, error, initial = {} }) => {
  const [form, setForm] = useState({
    name: initial.name || "",
    phone: initial.phone || "",
    city: initial.city || "",
    street: initial.street || "",
    landmark: initial.landmark || "",
    pincode: initial.pincode || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      className="bg-white p-8 rounded-lg w-full max-w-md border-green-700 border"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
        Add Address
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
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
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
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default AddressForm;
