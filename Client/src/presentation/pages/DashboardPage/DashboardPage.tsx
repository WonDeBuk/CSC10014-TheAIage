import { useAuth } from "@/app/providers/AuthProvider";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/"; // Redirect to home
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-lg">
          Logged in as: <b>{user?.Email}</b>
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

