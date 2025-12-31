import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate("/"); // Redirect to home
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-lg">
          Logged in as : <b>{user?.username}</b>
        </span>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full 
                     bg-black text-gray-600 
                     hover:bg-gray-800 
                     text-sm font-medium shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

