import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

type ChatProp = {
  image: string;
  full_name: string;
  online: boolean;
  email: string;
  blackListed: boolean;
};

const Chat = ({ online, image, full_name, email, blackListed }: ChatProp) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`${email}?blackListed=${blackListed}`);
  }, [blackListed]);
  return (
    <NavLink
      to={`${email}?blackListed=${blackListed}`}
      className={({ isActive }) => {
        return (
          "flex border-b-[0.1em] px-5 py-2 hover:bg-gray-100 cursor-pointer items-center " +
          (isActive ? "bg-gray-100" : " bg-white")
        );
      }}
    >
      <div className="me-3 h-[30px] w-[30px] relative">
        <img src={image} alt="" className="h-[100%] w-[100%] rounded-full" />
        <div
          className={`absolute h-[6px] w-[6px] ${
            online ? "bg-green-400" : "bg-gray-300"
          } rounded-full bottom-0 right-0`}
        ></div>
      </div>
      <div className="flex-1">
        <div className="">
          <p className="flex justify-between">
            <span>{full_name}</span>
            <span className="text-red-900 font-medium">
              {blackListed ? "blackListed" : ""}
            </span>
          </p>
          <p className="text-gray-400">{email}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default Chat;
