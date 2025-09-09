import { Navigate, Outlet } from "react-router-dom";
import apiCall from "../services/apiCallService";
import React, { useEffect, useState } from "react";

export const AuthLayout: React.FC = () => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await apiCall("/auth/validate", { method: "GET", requiresAuth: true, });

        if (res?.status === "success" && res?.data) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  if (loading) return null;

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};
