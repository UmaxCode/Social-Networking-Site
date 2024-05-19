import { ChangeEvent, useRef, useState } from "react";

type ChatInputProp = {
  clearInput: boolean;
  icon: string;
  name: string;
  placeholder: string;
  action: (data: string) => void;
};

const ChatInput = ({
  icon,
  name,
  placeholder,
  action,
  clearInput,
}: ChatInputProp) => {
  const [data, setData] = useState<string>("");

  const inputElement = useRef<HTMLInputElement>(null);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value);
  };
  return (
    <div className="relative">
      <input
        ref={inputElement}
        type="text"
        name={name}
        value={data}
        id={name}
        className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
        placeholder={placeholder}
        onChange={onChangeInput}
      />
      <div className="inline-flex justify-center items-center h-[100%] absolute end-2">
        <button
          onClick={() => {
            action(data);
            if (inputElement.current) {
              inputElement.current.value = " ";
              clearInput ? setData("") : null;
            }
          }}
          className={icon}
        ></button>
      </div>
    </div>
  );
};

export default ChatInput;
