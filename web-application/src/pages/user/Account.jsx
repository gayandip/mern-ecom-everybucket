import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Account = () => {
  const { userData } = useAppContext();
  const user = {
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  };

  const options = [
    {
      to: "/user/orders",
      text: "My Orders",
      bg: "green",
    },
    {
      to: "/user/account",
      text: "Edit Profile",
      bg: "blue",
    },
    {
      to: "/user/address",
      text: "Manage Address",
      bg: "yellow",
    },
    {
      to: "/user/settings",
      text: "Account Settings",
      bg: "gray",
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
            key={opt.to}
            to={opt.to}
            className={`bg-${opt.bg}-100 p-4 rounded-lg shadow hover:bg-${opt.bg}-200 text-center font-semibold`}
          >
            {opt.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Account;
