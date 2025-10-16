// services/Helpers.js
export const buttonProvider = (location, navigate, currentUser) => {
  if (location === "/signUp") {
    return {
      className: "topbar-login-btn",
      title: "Login",
      action: () => navigate("/login"),
    };
  } else if (location === "/login") {
    return {
      className: "topbar-signUp-btn",
      title: "SignUp",
      action: () => navigate("/signUp"),
    };
  } else if (!currentUser?.email) {
    return {
      className: "topbar-signUp-btn",
      title: "SignUp",
      action: () => navigate("/signUp"),
    };
  } else {
    return {
      className: "topbar-logout-btn",
      title: "Logout",
      action: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    };
  }
};
