import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRouter = ({ children }) => {
  const { user, loading } = useAuth();
  const activeRouterLocation = useLocation();

  if (loading) {
    return (
      <progress
        className="progress progress-primary w-56"
        value="0"
        max="100"
      ></progress>
    );
  }

  if (!user) {
    return (
      <Navigate to={"/login"} state={{ from: activeRouterLocation }} replace />
    );
  }
  return children;
};

export default PrivateRouter;
