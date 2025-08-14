import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Account = () => {
  const { userData } = useAppContext();
  const user = {
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phoneNumber || "",
  };

  const options = [
    {
      to: "/user/orders",
      text: "My Orders",
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
    },
    {
      to: "/user/account",
      text: "Edit Profile",
      bg: "bg-blue-100",
      hover: "hover:bg-blue-200",
    },
    {
      to: "/user/address",
      text: "Manage Address",
      bg: "bg-yellow-100",
      hover: "hover:bg-yellow-200",
    },
    {
      to: "/user/account",
      text: "Account Settings",
      bg: "bg-gray-100",
      hover: "hover:bg-gray-200",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg mt-8">
      <div className="flex items-center gap-6 mb-6">
        <div className="avtar">{user.name[0]}</div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        {options.map((opt) => (
          <Link
            key={opt.text}
            to={opt.to}
            className={`${opt.bg} p-4 rounded-lg shadow ${opt.hover} text-center font-semibold`}
          >
            {opt.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Account;
