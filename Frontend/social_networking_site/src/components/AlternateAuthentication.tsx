import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AlternateAuthentication = () => {
  const navigate = useNavigate();

  const loginGoogleOauth = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("http://localhost:3001/auth/oauth/registration", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullname: `${data.name}`,
              email: `${data.email}`,
              picture: `${data.picture}`,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.message) {
                localStorage.setItem("token", data.token);
                toast.success(data.message);
                setTimeout(() => {
                  navigate("/chat");
                }, 3000);
              } else {
                toast.error(data.error);
              }
            });
        });
    },
  });

  return (
    <div className="mt-4">
      <p className="flex justify-between items-center px-2 mb-3">
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
        <span className="text-gray-400">Or</span>
        <span className="h-[1px] w-[45%] bg-gray-400"></span>
      </p>

      <button className="w-[100%] bg-blue-900 text-white py-2 px-4 rounded text-center">
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
