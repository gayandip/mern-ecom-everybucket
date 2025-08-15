import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiPost } from "../../hooks/useApiPost";

const ListProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    stocks: "",
    mrp: "",
    sellingPrice: "",
    category: "",
    otherDetails: "",
    warranty: "",
    images: [null, null, null],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);

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

  const { storeId } = useParams();
  const navigate = useNavigate();
  const { post, loading: postLoading, error: postError } = useApiPost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !form.name ||
      !form.description ||
      !form.stocks ||
      !form.mrp ||
      !form.sellingPrice ||
      !form.category
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("stocks", form.stocks);
    formData.append("mrp", form.mrp);
    formData.append("sellingPrice", form.sellingPrice);
    formData.append("category", form.category.trim().toLowerCase());
    formData.append("otherDetails", form.otherDetails);
    formData.append("warranty", form.warranty);
    form.images.filter(Boolean).forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await post(`/products/add-new/${storeId}`, formData);
      if (res && res.message) {
        alert(res.message);
        setForm({
          name: "",
          description: "",
          stocks: "",
          mrp: "",
          sellingPrice: "",
          category: "",
          otherDetails: "",
          warranty: "",
          images: [null, null, null],
        });
        setImagePreviews([null, null, null]);
        navigate(-1);
      } else {
        setError(postError?.response?.data?.message || "Error listing product");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error listing product");
    } finally {
      setLoading(false);
    }
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="stocks">
              Stock
            </label>
            <input
              type="number"
              id="stocks"
              name="stocks"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.stocks}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="mrp">
              MRP (₹)
            </label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.mrp}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="sellingPrice">
              Selling Price (₹)
            </label>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.sellingPrice}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="e.g. Electronics, Grocery, Fashion"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="otherDetails">
              Other Details
            </label>
            <input
              type="text"
              id="otherDetails"
              name="otherDetails"
              placeholder="e.g. blue, nice"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.otherDetails}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="warranty">
              Warranty
            </label>
            <input
              type="text"
              id="warranty"
              name="warranty"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              value={form.warranty}
              onChange={handleChange}
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
