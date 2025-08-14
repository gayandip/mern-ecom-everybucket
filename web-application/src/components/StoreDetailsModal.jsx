const StoreDetailsModal = ({ store, onClose }) => {
  if (!store) return null;
  const s = store.data || store;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">Store Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Store Name:</span> {s.storeName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Owner Name:</span> {s.ownerName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Description:</span> {s.description}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Phone:</span> {s.contact?.phone}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Address:</span> {s.contact?.address}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Created At:</span>{" "}
          {s.createdAt ? new Date(s.createdAt).toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsModal;
