const StoreDetailsModal = ({ store, onClose }) => {
  if (!store) return null;
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
          <span className="font-semibold">Store Name:</span> {store.storeName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Owner Name:</span> {store.ownerName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Description:</span>{" "}
          {store.description}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Phone:</span> {store.contact?.phone}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Address:</span>{" "}
          {store.contact?.address}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsModal;
