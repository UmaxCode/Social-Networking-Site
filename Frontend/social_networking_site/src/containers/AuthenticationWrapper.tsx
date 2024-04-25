import { Outlet, useLocation } from "react-router-dom";
import login from "../assets/auth_image.png";
import signup from "../assets/signup_image.png";
import { Toaster } from "react-hot-toast";

const AuthenticationWrapper = () => {
  const location = useLocation();

  return (
    <div className="h-[100vh] bg-white md:grid md:grid-cols-2">
      <div className="bg-telegram-default hidden md:flex justify-center items-center">
        <img
          src={location.pathname === "/" ? login : signup}
          alt="illustrator image to represent account creation and login"
          className="w-[70%]"
        />
      </div>
      <div className="flex justify-center items-center h-[100%]">
        <Outlet />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AuthenticationWrapper;
