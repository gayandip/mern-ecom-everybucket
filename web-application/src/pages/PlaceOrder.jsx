import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiGet } from "../hooks/useApiGet";
import { useAppContext } from "../context/AppContext";
import { useApiPost } from "../hooks/useApiPost";
import { getImageUrl } from "../context/AppContext";

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
    if (product?.data && product.data.stocks > 0) {
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (postError) {
      setError(postError?.response?.data?.message || "Something went wrong");
    }
  }, [postError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!userData || !userData.address) {
      navigate("/user/address", { state: { from: `/order/${id}` } });
      return;
    }
    if (!product?.data || !product.data._id) {
      setError("Product not found");
      return;
    }
    setLoading(true);
    const orderBody = {
      product: {
        id: product.data._id,
        quantity: Number(quantity),
      },
      seller: product.data.owner,
    };
    const res = await post("/orders/place-order", orderBody);
    setLoading(false);
    if (res && !res.error) {
      setSuccess(true);
      navigate("/user/orders", { replace: true });
    }
  };

  if (productLoading) return <div>Loading...</div>;
  if (productError || !product?.data)
    return <div className="text-red-500">Product not found</div>;

  // Calculate prices
  const subtotal = (product.data.priceInfo?.sellingPrice || 0) * quantity;
  const others = 0; // You can add delivery/other costs if needed
  const total = subtotal + others;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Order/Product Summary */}
      <div className="bg-white max-w-md max-h-fit rounded-lg p-6 flex-1 flex flex-col justify-between md:mb-0 border-1 border-b-green-800">
        <h3 className="text-xl font-bold mb-4 text-green-700">Order Summary</h3>
        <div className="flex justify-between gap-4 mb-4">
          <img
            src={getImageUrl(product.data.images?.[0])}
            alt={product.data.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex items-start flex-col">
            <div className="font-semibold">{product.data.name}</div>

            <div className="text-blue-700 font-bold">
              ₹{product.data.priceInfo?.sellingPrice}
            </div>
          </div>
        </div>
        <div className="text-gray-600 text-sm flex items-center mb-6 justify-center gap-2">
          Qty:
          <button
            type="button"
            className="px-2 border rounded bg-white hover:bg-gray-100 font-extrabold text-xl"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={product.data.stocks}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  1,
                  Math.min(product.data.stocks, Number(e.target.value))
                )
              )
            }
            className="w-16 px-2 py-1 border rounded text-center"
            style={{ width: 60 }}
          />
          <button
            type="button"
            className="px-2 border rounded bg-white hover:bg-gray-100 font-extrabold text-xl"
            onClick={() =>
              setQuantity((q) => Math.min(product.data.stocks, q + 1))
            }
            disabled={quantity >= product.data.stocks}
          >
            +
          </button>
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
        className="bg-white p-4 px-8 rounded-lg w-full max-w-md flex-1 border-green-700 border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Delivery Details
        </h2>
        {userData && userData.address && (
          <div className="mb-4 p-4 bg-gray-50 rounded border">
            <div className="font-semibold">name: {userData.address.name}</div>
            <div>phone: {userData.address.phone}</div>
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
        {product.data.stocks > 0 ? (
          <button
            type="submit"
            className="btn-green w-full disabled:opacity-60"
            disabled={loading || postLoading}
          >
            {loading || postLoading ? "Placing Order..." : "Place Order"}
          </button>
        ) : (
          <button
            type="button"
            className="btn-green w-full opacity-60 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </button>
        )}
      </form>
    </div>
  );
};

export default PlaceOrder;
