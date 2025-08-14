import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet } from "../hooks/useApiGet";
import { useAppContext } from "../context/AppContext";
import { useApiPost } from "../hooks/useApiPost";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
function getImageUrl(img) {
  if (!img) return "";
  if (/^https?:\/\//.test(img)) return img;
  const path = img.startsWith("/") ? img : "/" + img;
  const base = BACKEND_URL.replace(/\/api\/v1$/, "");
  return base + path;
}

const PlaceOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useAppContext();
  const {
    data: product,
    loading: productLoading,
    error: productError,
  } = useApiGet(`/products/get/${id}`);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { post, loading: postLoading, error: postError } = useApiPost();

  useEffect(() => {
    if (product && product.stocks > 0) {
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (userData && !userData.address) {
      navigate("/user/add-address", { state: { from: `/order/${id}` } });
    }
  }, [userData, navigate, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!userData || !userData.address) {
      navigate("/user/add-address", { state: { from: `/order/${id}` } });
      return;
    }
    if (!product || !product._id) {
      setError("Product not found");
      return;
    }
    setLoading(true);
    try {
      const orderBody = {
        product: {
          id: product._id,
          quantity: Number(quantity),
          delivery: true,
        },
        seller: product.owner,
        address: userData.address,
      };
      const res = await post("/orders/place-order", orderBody);
      if (!res) throw new Error("Order failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) return <div>Loading...</div>;
  if (productError || !product)
    return <div className="text-red-500">Product not found</div>;

  // Calculate prices
  const subtotal = (product.priceInfo?.sellingPrice || 0) * quantity;
  const others = 0; // You can add delivery/other costs if needed
  const total = subtotal + others;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order/Product Summary */}
      <div className="bg-white max-w-md max-h-fit rounded-lg p-6 flex-1 flex flex-col justify-between md:mb-0 border-1 border-b-green-800">
        <h3 className="text-xl font-bold mb-4 text-green-700">Order Summary</h3>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-gray-600 text-sm">
              Qty:
              <input
                type="number"
                min={1}
                max={product.stocks}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(product.stocks, Number(e.target.value))
                    )
                  )
                }
                className="w-16 ml-2 px-2 py-1 border rounded"
                style={{ width: 60 }}
              />
              <span className="ml-2 text-xs text-gray-400">
                (In stock: {product.stocks})
              </span>
            </div>
            <div className="text-blue-700 font-bold">
              ₹{product.priceInfo?.sellingPrice}
            </div>
          </div>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Others</span>
          <span>₹{others}</span>
        </div>
        <div className="mb-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
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
        {userData && userData.address && (
          <div className="mb-4 p-4 bg-gray-50 rounded border">
            <div className="font-semibold">{userData.address.name}</div>
            <div>{userData.address.phone}</div>
            <div>
              {userData.address.street}, {userData.address.city}
            </div>
            <div>{userData.address.landmark}</div>
            <div>Pincode: {userData.address.pincode}</div>
          </div>
        )}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && (
          <div className="mb-4 text-green-600 text-center">
            Order placed successfully!
          </div>
        )}
        <button
          type="submit"
          className="btn-green w-full disabled:opacity-60"
          disabled={loading || postLoading}
        >
          {loading || postLoading ? "Placing Order..." : "Place Order"}
        </button>
        {postError && (
          <div className="text-red-500 text-center mt-2">{postError}</div>
        )}
      </form>
    </div>
  );
};

export default PlaceOrder;
