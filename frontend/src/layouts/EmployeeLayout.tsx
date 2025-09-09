import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const EmployeeLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  const roleName = user?.role?.name;

  return roleName === "employee" ? <Outlet /> : <Navigate to="/forbidden" replace />;
};
