import { Outlet, useLocation } from "react-router-dom";
import login from "../assets/auth_image.png";
import signup from "../assets/signup_image.png";
import forgot from "../assets/Forgot password.png";

const AuthenticationWrapper = () => {
  const location = useLocation();

  let path;
  if (location.pathname === "/") {
    path = login;
  } else if (location.pathname === "/signup") {
    path = signup;
  } else {
    path = forgot;
  }

  return (
    <div className="h-[100vh] bg-white md:grid md:grid-cols-2">
      <div className="bg-telegram-default hidden md:flex justify-center items-center">
        <img
          src={path}
          alt="illustrator image to represent account creation and login"
          className="w-[70%]"
        />
      </div>
      <div className="flex justify-center items-center h-[100%] p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticationWrapper;
