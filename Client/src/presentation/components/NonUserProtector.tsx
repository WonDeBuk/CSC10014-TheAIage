import { Navigate, Outlet } from "react-router-dom";

const NonUserProtector = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default NonUserProtector;