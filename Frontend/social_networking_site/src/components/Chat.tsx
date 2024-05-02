import { NavLink } from "react-router-dom";

type ChatProp = {
  image: string;
  full_name: string;
  last_message: string;
  time: string;
  status: boolean;
  chatid: number;
};

const Chat = ({
  status,
  image,
  full_name,
  last_message,
  time,
  chatid,
}: ChatProp) => {
  return (
    <NavLink
      to={`${chatid}`}
      className={({ isActive }) => {
        console.log(isActive);
        return (
          "flex border-b-[0.1em] px-5 py-2 hover:bg-gray-100 cursor-pointer items-center " +
          (isActive ? "bg-gray-100" : " bg-white")
        );
      }}
    >
      <div className="me-3 h-[30px] w-[30px] relative">
        <img src="" alt="" className="h-[100%] w-[100%] rounded-full" />
        <div
          className={`absolute h-[6px] w-[6px] ${
            status ? "bg-green-400" : "bg-gray-300"
          } rounded-full bottom-0 right-0`}
        ></div>
      </div>
      <div className="flex-1">
        <p className="flex justify-between">
          <span>{full_name}</span>
          <span className="text-gray-400">{time}</span>
        </p>
        <p className="flex justify-between items-center">
          <span className="text-gray-400">{last_message}</span>
          <span className=" bg-telegram-default text-white text-[0.7em] h-[16px] w-[16px] flex justify-center items-center rounded-full">
            1
          </span>
        </p>
      </div>
    </NavLink>
  );
};

export default Chat;
