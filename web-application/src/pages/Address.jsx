import { use, useState } from "react";
import AddressForm from "../components/AddressForm";
import { useAppContext } from "../context/AppContext";
import { useApiPost } from "../hooks/useApiPost";

const Address = () => {
  const { userData, setUserData } = useAppContext();
  const [showForm, setShowForm] = useState(!userData?.address);
  const [error, setError] = useState("");
  const { post, loading } = useApiPost();

  const handleAddressSubmit = async (address) => {
    setError("");

    const res = await post("/users/update/address", { address });
    if (res && res.success) {
      setUserData({ ...userData, address });
      setShowForm(false);
    } else {
      setError(res?.message || "Failed to update address");
    }
  };

  // If no address, show only the form
  if (!userData?.address || showForm) {
    return (
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-6">
        {userData?.address && !showForm && (
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Your Address</h2>
            <div className="bg-white p-6 rounded-lg border shadow">
              <div>
                <b>Name:</b> {userData.address.name}
              </div>
              <div>
                <b>Phone:</b> {userData.address.phone}
              </div>
              <div>
                <b>Street:</b> {userData.address.street}
              </div>
              <div>
                <b>Landmark:</b> {userData.address.landmark}
              </div>
              <div>
                <b>City:</b> {userData.address.city}
              </div>
              <div>
                <b>State:</b> {userData.address.state}
              </div>
              <div>
                <b>Pincode:</b> {userData.address.pincode}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowForm(true)}
              >
                Change Address
              </button>
            </div>
          </div>
        )}
        <div className="w-full md:w-1/2">
          <AddressForm
            onSubmit={handleAddressSubmit}
            loading={loading}
            error={error}
            initial={userData?.address || {}}
          />
        </div>
      </div>
    );
  }
  // If address exists and not editing, show address with change button
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-xl font-bold mb-4">Your Address</h2>
      <div className="bg-white p-6 rounded-lg border shadow w-full max-w-md">
        <div>
          <b>Name:</b> {userData.address.name}
        </div>
        <div>
          <b>Phone:</b> {userData.address.phone}
        </div>
        <div>
          <b>Street:</b> {userData.address.street}
        </div>
        <div>
          <b>Landmark:</b> {userData.address.landmark}
        </div>
        <div>
          <b>City:</b> {userData.address.city}
        </div>
        <div>
          <b>State:</b> {userData.address.state}
        </div>
        <div>
          <b>Pincode:</b> {userData.address.pincode}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setShowForm(true)}
        >
          Change Address
        </button>
      </div>
    </div>
  );
};

export default Address;
