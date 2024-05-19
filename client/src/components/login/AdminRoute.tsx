import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const AdminRoute = () => {
  const authContext = useAuthContext();
  if (!authContext.authState.isAdmin) return <Navigate to="/app" />;
  return <Outlet />;
};

export default AdminRoute;