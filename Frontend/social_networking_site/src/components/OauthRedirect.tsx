import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../contexts/AuthWrapper";
import toast from "react-hot-toast";

const OauthRedirect = () => {
  const { login, authenticate } = AuthData();

  const queryParams = new URLSearchParams(window.location.search);
  const authorization_code = queryParams.get("code");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(authorization_code);
    async function returnCode() {
      try {
        const response = await fetch(
          `http://localhost:3001/auth/oauth_google_callback?code=${authorization_code}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("DFDFDFDF");
        }
        const data = await response.json();
        console.log(data);
        login(data.token);
        toast.success(`${data.message}`);
        setTimeout(() => navigate(`/${data.username}/chats`), 3000);
      } catch (error) {
        console.log(error);
      }
    }

    returnCode();
  }, []);

  return <div>Redirecting....</div>;
};

export default OauthRedirect;
