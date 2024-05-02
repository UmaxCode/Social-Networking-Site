import { useState } from "react";

type ChatInputProp = {
  icon: string;
  name: string;
  action: () => void;
};

const ChatInput = ({ icon, name, action }: ChatInputProp) => {
  const [data, setData] = useState("");

  const onChangeSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value);
  };
  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={data}
        id={name}
        className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
        placeholder="search..."
        onChange={onChangeSearchInput}
      />
      <div className="inline-flex justify-center items-center h-[100%] absolute end-2">
        <button onClick={action} className={icon}></button>
      </div>
    </div>
  );
};

export default ChatInput;
