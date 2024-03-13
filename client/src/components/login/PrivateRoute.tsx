import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const PrivateRoute = () => {
  const authContext = useAuthContext();
  if (!authContext.authState.user) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;