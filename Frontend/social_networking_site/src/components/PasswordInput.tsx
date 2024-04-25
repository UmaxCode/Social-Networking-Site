import * as React from "react";

type Prop = {
  name: string;
  value: string;
  id: string;
  placeholder: string;
  onFormChangeInput: () => void;
};

const PasswordInput = ({
  name,
  value,
  placeholder,
  id,
  onFormChangeInput,
}: Prop) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <input
        type={`${showPassword ? "text" : "password"}`}
        name={name}
        value={value}
        id={id}
        className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
        placeholder={placeholder}
        onChange={onFormChangeInput}
      />
      <div className="inline-flex justify-center items-center h-[100%] absolute end-2">
        {showPassword ? (
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`text-xl bi bi-eye-fill`}
            style={{ right: "8px", cursor: "pointer" }}
          ></i>
        ) : (
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`text-xl bi bi-eye-slash-fill `}
            style={{ right: "8px", cursor: "pointer" }}
          ></i>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
