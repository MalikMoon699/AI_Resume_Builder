import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        richColors
        position="bottom-right"
        closeButton
        dismissible
        toastOptions={{
          duration: 4000,
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);
