import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../contexts/AuthWrapper";

const AlternateAuthentication = () => {
  const navigate = useNavigate();

  const { login, setProfilePic } = AuthData();

  const loginGoogleOauth = useGoogleLogin({
    onSuccess: (authResponse) => {
      async function returnCode() {
        console.log(authResponse);
        try {
          const response = await fetch(
            `http://localhost:3001/auth/oauth_google_callback?code=${authResponse.code}`
          );
          console.log(response);
          if (!response.ok) {
            throw new Error("DFDFDFDF");
          }
          const data = await response.json();
          console.log(data);
          login(data.token);
          setProfilePic(data.profile_pic);

          toast.success(`${data.message}`);
          setTimeout(() => navigate(`/${data.username}/chats`), 3000);
        } catch (error) {
          console.log(error);
        }
      }

      returnCode();
    },
    flow: "auth-code",
  });

  return (
    <div className="mt-4">
      <p className="flex justify-between items-center px-2 mb-3">
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
        <span className="text-gray-400">Or</span>
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
      </p>

      <button
        onClick={() => {}}
        className="w-[100%] bg-blue-900 text-white py-2 px-4 rounded text-center"
      >
        <i className="bi bi-facebook me-3"></i>
        <span>Login with Facebook</span>
      </button>

      <button
        onClick={() => loginGoogleOauth()}
        className="w-[100%] border border-blue-900 text-blue-900 py-2 px-4 rounded text-center mt-5"
      >
        <i className="bi bi-google me-3 "></i>
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default AlternateAuthentication;
