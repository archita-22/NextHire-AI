import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Read the session directly from localStorage to ensure immediate detection
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // If either the token or user object is missing, redirect to login
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, safely allow access to the Dashboard pages
  return children;
}

export default ProtectedRoute;
