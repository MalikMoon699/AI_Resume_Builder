import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authAllow, setAuthAllow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(false);

  const navigate = useNavigate();

 const fetchMe = async () => {
   const token = localStorage.getItem("token");

   if (!token) {
     setCurrentUser(null);
     setAuthAllow(false);
     setIsDetail(false);
     setLoading(false);
     return;
   }

   try {
     const res = await API.get("/auth/user");
     setCurrentUser(res.data.user);
     setAuthAllow(true);
     setIsDetail(Boolean(res.data.user.name && res.data.user.email));
   } catch (err) {
     console.error(
       "[AuthContext] Auth check failed, but KEEPING token for debugging"
     );
     console.error("❌ Error details:", err.response?.data);
     setCurrentUser(null);
     setAuthAllow(false);
     setIsDetail(false);
   } finally {
     setLoading(false);
   }
 };

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setAuthAllow(false);
    setIsDetail(false);
    if (redirect) navigate("/login");
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        currentUser,
        authAllow,
        loading,
        refresh: fetchMe,
        isDetail,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
