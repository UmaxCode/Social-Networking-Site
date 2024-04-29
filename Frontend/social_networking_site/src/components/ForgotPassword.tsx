import { Link } from "react-router-dom";
import { useFormBinding } from "../hooks/useFormBinding";
import SiginSignupButton from "./SiginSignupButton";
import { useState } from "react";
import toast from "react-hot-toast";

const userData = {
  email: "",
};
const ForgotPassword = () => {
  const [formInput, setFormInput, validator, onFormChangeInput, formErrors] =
    useFormBinding(userData);

  const [processReq, setProcessReq] = useState(false);

  const resetPassword = (event: any) => {
    event.preventDefault();

    const data = {
      ...formInput,
    };

    const validationState = validator(data);
    if (validationState) {
      setProcessReq(true);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch("http://localhost:3001/auth/password_reset", options)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message) {
            console.log(data);
            toast.success(data.message);
            setFormInput(userData);
          } else {
            toast.error(data.error);
          }
        })

        .catch((err) => console.log(err))
        .finally(() => setProcessReq(false));
    }
  };

  return (
    <div className="max-w-[450px] w-[90%]">
      <div className="">
        <i className="bi bi-person-fill-gear text-telegram-default text-[3.5em] block text-center mb-2"></i>
        <h2 className="text-2xl mb-4">Trouble Logging In?</h2>
        <p className="text-gray-600 mb-3">
          Enter your email and we'll send you a link to get back into your
          account
        </p>
      </div>

      <form action="" method="POST" onSubmit={resetPassword} noValidate>
        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formInput.email}
            onChange={onFormChangeInput}
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
            placeholder="Enter your email"
          />
          <div className="text-red-400 px-2">{formErrors.email}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center">
          <SiginSignupButton text="Reset" reqSent={processReq} />
          <span className="text-center flex flex-col items-center p-3">
            <span className="w-[2px] h-[8px] bg-gray-400"></span>
            <span className="text-gray-400">OR</span>
            <span className="w-[2px] h-[8px] bg-gray-400"></span>
          </span>
          <Link to="/signup" className="text-center text-blue-500 ">
            Create New Account
          </Link>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Return to{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
