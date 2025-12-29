import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function RouteProtector({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  console.log(user)
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return children;
  }

  return children;
  //return <Navigate to="/login" replace />;
}