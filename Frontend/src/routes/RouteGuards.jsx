import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();
  const location = useLocation();

const isResumePublic =
  location.pathname.startsWith("/resume/") || location.pathname === "/";

  
  if (loading) {
    return (
      <Loader
        size="100"
        style={{ height: "" }}
        className="create-resume-loading"
        stroke="6"
      />
    );
  }

 if (isResumePublic) {
   return children;
 }

  if (!authAllow) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { authAllow, loading } = useAuth();

  if (loading) {
    return (
      <Loader
        size="100"
        style={{ height: "" }}
        className="create-resume-loading"
        stroke="6"
      />
    );
  }

  if (authAllow) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
