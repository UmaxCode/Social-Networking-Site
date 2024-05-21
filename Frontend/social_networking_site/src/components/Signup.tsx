import { Link } from "react-router-dom";
import { useFormBinding } from "../hooks/useFormBinding";
import PasswordInput from "./PasswordInput";
import { useCallback } from "react";
import Modal from "./Modal";
import toast from "react-hot-toast";
import ActionButton from "./ActionButton";

const userData = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  conpassword: "",
};
const Signup = () => {
  const [formInput, setFormInput, validator, onFormChangeInput, formErrors] =
    useFormBinding(userData);

  const [processReq, setProcessReq] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

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
      fetch("http://localhost:3001/auth/register", options)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message) {
            setShowModal(true);
            setModalMessage(data.message);
            console.log(data);
          } else {
            toast.error(data.error);
            console.log(data.error);
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
          <p className="text-2xl mb-3 text-gray-600">Sign up</p>
        </div>
        <form onSubmit={onFormSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formInput.fullname}
              onChange={onFormChangeInput}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
              placeholder="Enter your full name"
            />
            <div className="text-red-400 px-2">{formErrors.fullname}</div>
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formInput.username}
              onChange={onFormChangeInput}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
              placeholder="Enter your username"
            />
            <div className="text-red-400 px-2">{formErrors.username}</div>
          </div>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 mb-2">
              email
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
            <div className="text-red-400 ps-2">{formErrors.email}</div>
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

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700  mb-2">
              Confirm Password
            </label>

            <PasswordInput
              name="conpassword"
              value={formInput.conpassword}
              id="conpassword"
              placeholder="confirm your password"
              onFormChangeInput={onFormChangeInput}
            />
            <div className="text-red-400 px-2">{formErrors.conpassword}</div>
          </div>

          <ActionButton
            text="Create Account"
            reqSent={processReq}
            styles="bg-telegram-light text-white py-2 px-4 rounded-md hover:bg-telegram-default focus:bg-telegram-default"
          />
          <p className="flex gap-2 justify-center my-3">
            Already have an account?
            <Link to="/" className="text-blue-500 t block">
              login
            </Link>
          </p>
        </form>
      </div>

      <Modal
        open={showModal}
        setModalState={useCallback(() => {
          setShowModal(false);
          setFormInput(userData);
        }, [])}
        message={modalMessage}
      />
    </>
  );
};

export default Signup;
