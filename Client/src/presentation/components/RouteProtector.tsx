import { Navigate, Outlet } from "react-router-dom";

const RouteProtector = () => {
  if (localStorage.getItem("token")) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default RouteProtector;