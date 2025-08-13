import { useState } from "react";
import AddressForm from "../components/AddressForm";
import { useNavigate, useLocation } from "react-router-dom";

const AddAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddressSubmit = async (address) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/update/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update address");
      }
      // If redirected from /order/:id, go back to that page
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else {
        navigate(-1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressForm
      onSubmit={handleAddressSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default AddAddress;
