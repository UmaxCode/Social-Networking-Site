import { useFormBinding } from "../hooks/useFormBinding";
import AlternateAuthentication from "./AlternateAuthentication";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import SiginSignupButton from "./SiginSignupButton";
import { useState } from "react";
import toast from "react-hot-toast";

const userData = {
  email: "",
  password: "",
};

const Signin = () => {
  const [formInput, setFormInput, validator, onFormChangeInput, formErrors] =
    useFormBinding(userData);

  const [processReq, setProcessReq] = useState(false);

  const navigate = useNavigate();

  function onFormSubmit(event: any) {
    event.preventDefault();

    const data = {
      ...formInput,
    };

    const validationState = validator(data);
    if (validationState) {
      setProcessReq(true);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch("http://localhost:3001/auth/authenticate", options)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            console.log(data);
            setFormInput(userData);
            navigate("/chat");
          } else {
            console.log(data.error);
            toast.error(data.error);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setProcessReq(false));
    }
  }

  return (
    <>
      <div className=" max-w-[450px] w-[90%]">
        <div className="text-center">
          <p className="text-2xl mb-3 text-gray-600">Login</p>
        </div>
        <form onSubmit={onFormSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formInput.email}
              onChange={onFormChangeInput}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
              placeholder="Enter your email"
            />
            <div className="text-red-400 px-2">{formErrors.email}</div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700  mb-2">
              Password
            </label>
            <PasswordInput
              name={"password"}
              value={formInput.password}
              placeholder={"enter your password"}
              id={"password"}
              onFormChangeInput={onFormChangeInput}
            />
            <div className="text-red-400 px-2">{formErrors.password}</div>
          </div>
          <Link to="" className="text-blue-500 text-center block">
            Forgot password?
          </Link>
          <SiginSignupButton text="Login" reqSent={processReq} />
        </form>
        <p className="flex gap-2 justify-center my-3">
          Don't have an account?
          <Link to="signup" className="text-blue-500 t block">
            Signup
          </Link>
        </p>
        <AlternateAuthentication />
      </div>
    </>
  );
};

export default Signin;
