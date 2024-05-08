import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./contexts/AuthWrapper";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="803682622027-gm8ksfqkmq99a0cdscuamda6udjvlm4l.apps.googleusercontent.com">
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </GoogleOAuthProvider>
    <Toaster position="top-center" reverseOrder={false} />
  </React.StrictMode>
);
