import React from "react";

const ListProduct = () => {
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    category: "",
    customCategory: "",
    stock: "",
    description: "",
    images: [null, null, null],
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState([null, null, null]);

  const handleSingleImageChange = (idx, e) => {
    const file = e.target.files[0] || null;
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[idx] = file;
      return { ...prev, images: newImages };
    });
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[idx] = file ? URL.createObjectURL(file) : null;
      return newPreviews;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!form.name || !form.price || !form.category || !form.stock) {
        setError("Please fill all required fields.");
      } else {
        alert("Product listed successfully!");
        setForm({
          name: "",
          price: "",
          category: "",
          customCategory: "",
          stock: "",
          description: "",
          images: [null, null, null],
        });
        setImagePreviews([null, null, null]);
      }
    }, 1200);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold m-4 text-center text-green-700">
        List New Product
      </h2>
      <div className="bg-white rounded-lg w-full flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Image upload section */}
        <div className="max-w-md md:mr-8 flex flex-col items-center text-center">
          <label className="block font-semibold mb-4">Product Images</label>
          <div className="grid grid-cols-3 gap-8 w-full md:grid-cols-1">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                <label
                  htmlFor={`image-upload-${idx}`}
                  className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {imagePreviews[idx] ? (
                    <img
                      src={imagePreviews[idx]}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">
                      Upload
                      <br />
                      Image
                    </span>
                  )}
                  <input
                    type="file"
                    id={`image-upload-${idx}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSingleImageChange(idx, e)}
                  />
                </label>
                {imagePreviews[idx] && (
                  <button
                    type="button"
                    className="text-xs text-red-500 mt-1"
                    onClick={() => {
                      setForm((prev) => {
                        const newImages = [...prev.images];
                        newImages[idx] = null;
                        return { ...prev, images: newImages };
                      });
                      setImagePreviews((prev) => {
                        const newPreviews = [...prev];
                        newPreviews[idx] = null;
                        return newPreviews;
                      });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Form section */}
        <form
          className="max-w-md w-full flex flex-col"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="name">
              Product Name
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
            <label className="block mb-2 font-semibold" htmlFor="price">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option>Electronics</option>
              <option>Mobiles</option>
              <option>Accessories</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Grocery</option>
              <option>Others</option>
            </select>
            {form.category === "Others" && (
              <input
                type="text"
                name="customCategory"
                placeholder="Enter custom category"
                className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                value={form.customCategory}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="stock">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="btn-green w-full disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Listing..." : "List Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListProduct;
