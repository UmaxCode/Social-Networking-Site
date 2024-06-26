import { useRef, useState, Fragment, useEffect, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import PasswordInput from "./PasswordInput";
import { useFormBinding } from "../hooks/useFormBinding";
import toast from "react-hot-toast";
import avataImage from "../assets/avatar.jpg";
import { AuthData } from "../contexts/AuthWrapper";
import { Link, useNavigate } from "react-router-dom";
import ActionButton from "./ActionButton";
import backendEndpoints from "./endpoints";

const userData = {
  oldpassword: "",
  password: "",
  conpassword: "",
};

type UserDetailsType = {
  info: InfoType;
  contacts: ContactType[];
};

type ContactType = {
  fullname: string;
  email: string;
  state: string;
};
type InfoType = {
  pic: string;
  fullname: string;
  username: string;
  email: string;
  role: string;
};

type File = {
  fileSeleted: boolean;
  file: Blob;
};

type UpdateStatus = {
  infoToggler: boolean;
  contactToggler: boolean;
};

const formData = new FormData();

const UserSettings = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [processReq, setProcessReq] = useState({
    password: false,
    profile: false,
    contactState: false,
  });

  const [userDetails, setUserDetails] = useState<UserDetailsType>();

  const [userDetailsUpdate, setUserDetailsUpdated] = useState<UpdateStatus>({
    infoToggler: false,
    contactToggler: false,
  });

  const [formInput, setFormInput, validator, onFormChangeInput, formErrors] =
    useFormBinding(userData);

  const [fileSeletion, setFilSelection] = useState<File>({
    fileSeleted: false,
    file: new Blob(),
  });

  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const { authenticate, setProfilePic } = AuthData();

  useEffect(() => {
    if (!authenticate.isAuthenticated) {
      navigate("/");
      return;
    }
    const options = {
      method: "Get",
      headers: {
        Authorization: `Bearer ${authenticate.token}`,
        "Content-Type": "application/json",
      },
    };

    const loadUserDetails = async () => {
      try {
        const response = await fetch(
          backendEndpoints.load_UserDetails,
          options
        );

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();
        setUserDetails({ ...data });
      } catch (err) {
        const error = err as Error;
        toast.error(error.message);
      }
    };

    loadUserDetails();
  }, [userDetailsUpdate.infoToggler, userDetailsUpdate.contactToggler]);

  const updateProfilePic = (event: FormEvent) => {
    event.preventDefault();
    setProcessReq({ ...processReq, profile: true });
    formData.append(
      "file",
      fileSeletion.file,
      `${userDetails?.info.username}.png`
    );

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authenticate.token}`,
      },
      body: formData,
    };

    const update = async () => {
      try {
        const response = await fetch(backendEndpoints.update_profile, options);

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();
        setProfilePic(data.url);
        toast.success(data.message);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message);
      } finally {
        setUserDetailsUpdated({
          ...userDetailsUpdate,
          ["infoToggler"]: !userDetailsUpdate.infoToggler,
        });

        setProcessReq({ ...processReq, profile: false });
        closeModal();
      }
    };

    update();
  };

  const changePassword = (event: FormEvent) => {
    event.preventDefault();

    const validationState = validator(formInput);

    if (validationState) {
      setProcessReq({ ...processReq, password: true });

      const options = {
        method: "Put",
        headers: {
          Authorization: `Bearer ${authenticate.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: formInput.oldpassword,
          newPassword: formInput.password,
        }),
      };

      const change = async () => {
        try {
          const response = await fetch(
            backendEndpoints.change_password,
            options
          );

          if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.error);
          }

          const data = await response.json();
          toast.success(data.message);
          setFormInput(userData);
        } catch (err) {
          const error = err as Error;
          toast.error(error.message);
        } finally {
          setProcessReq({ ...processReq, password: false });
        }
      };

      change();
    }
  };

  const openModal = (event: any) => {
    const file = event.target.files[0];
    if (file.type === "image/png" || file.type === "image/jpeg") {
      setImage(URL.createObjectURL(file));
      setFilSelection({
        ...fileSeletion,
        ["fileSeleted"]: true,
        ["file"]: file,
      });
    } else {
      alert("Sorry and image is required");
    }
  };

  const closeModal = () => {
    setFilSelection({
      ...fileSeletion,
      ["fileSeleted"]: false,
      ["file"]: new Blob(),
    });
  };

  const changeContactState = (email: string, state: string) => {
    setProcessReq({ ...processReq, contactState: true });

    async function setState() {
      try {
        const response = await fetch(backendEndpoints.change_contactStatus, {
          method: "Put",
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contact: email, status: state }),
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();
        toast.success(data.message);
        setProcessReq({ ...processReq, contactState: false });
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setUserDetailsUpdated({
          ...userDetailsUpdate,
          ["contactToggler"]: !userDetailsUpdate.contactToggler,
        });
      }
    }

    setState();
  };
  return (
    <>
      <div className="max-w-[900px] mx-auto p-3">
        <Link to="../chats" className="font-medium">
          <i className="bi bi-arrow-left me-3"></i>
          Back to chats
        </Link>
        <div className="py-3 text-xl text-telegram-default uppercase">
          User Settings
        </div>
        <p className="py-2 text-gray-500 text-[1.3em] capitalize border-b-2 mb-2">
          User details
        </p>
        <div className="">
          <p>Profile Photo</p>
          <div className=" border h-[120px] w-[120px] rounded-md mt-2 mb-3">
            <img
              src={`${
                userDetails?.info.pic !== null
                  ? userDetails?.info.pic
                  : avataImage
              }`}
              alt={`${userDetails?.info.fullname.split(" ")[0]}'s profile`}
              className=" h-[100%] w-[100%] rounded-md  object-fill"
            />
          </div>
          <input
            type="file"
            name=""
            id=""
            ref={fileInput}
            className="hidden"
            onChange={openModal}
          />
          <button
            className="bg-telegram-default text-white w-[120px] py-2 rounded"
            onClick={() => fileInput.current?.click()}
          >
            Change profile
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 mb-2">
              Fullname
            </label>
            <input
              disabled
              type="text"
              defaultValue={userDetails?.info.fullname}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              disabled
              type="text"
              defaultValue={userDetails?.info.username}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              disabled
              type="text"
              defaultValue={userDetails?.info.email}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              User Role
            </label>
            <input
              disabled
              type="text"
              defaultValue={userDetails?.info.role}
              className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-telegram-default"
            />
          </div>
        </div>
        <p className="py-2 text-gray-500 text-[1.3em] capitalize border-b-2 mb-2">
          Security
        </p>
        <form className="mt-5" noValidate onSubmit={changePassword}>
          <div className="max-w-[500px] mx-auto">
            <div className="mb-4">
              <label
                htmlFor="oldpassword"
                className="block text-gray-700  mb-2"
              >
                Old Password
              </label>
              <PasswordInput
                name={"oldpassword"}
                value={formInput.oldpassword}
                placeholder={"enter your old password"}
                id={"oldpassword"}
                onFormChangeInput={onFormChangeInput}
              />
              <div className="text-red-400 px-2">{formErrors.oldpassword}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700  mb-2">
                New Password
              </label>
              <PasswordInput
                name={"password"}
                value={formInput.password}
                placeholder={"enter your new password"}
                id={"password"}
                onFormChangeInput={onFormChangeInput}
              />
              <div className="text-red-400 px-2">{formErrors.password}</div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="conpassword"
                className="block text-gray-700  mb-2"
              >
                Confirm New Password
              </label>
              <PasswordInput
                name={"conpassword"}
                value={formInput.conpassword}
                placeholder={"confirm new password"}
                id={"conpassword"}
                onFormChangeInput={onFormChangeInput}
              />
              <div className="text-red-400 px-2">{formErrors.conpassword}</div>
            </div>
            <ActionButton
              text="Change Password"
              reqSent={processReq.password}
              styles="bg-telegram-light text-white py-2 px-4 rounded-md hover:bg-telegram-default focus:bg-telegram-default"
            />
          </div>
        </form>
        <p className="py-2 text-gray-500 text-[1.3em] capitalize border-b-2 mb-2 mt-4">
          User Contacts
        </p>
        <div className="pt-3 flex flex-col gap-2">
          {userDetails?.contacts.map((contact, index) => {
            return (
              <div key={index} className="grid grid-cols-4 gap-3">
                <div className="border col-span-3 rounded px-3 py-2 hover:shadow-sm cursor-pointer">
                  <span className=" border-r-2 pr-2 ">{contact.fullname}</span>
                  <span className="border-r-2 pr-2 pl-2">{contact.email}</span>
                  <span
                    className={`ml-2 text-white rounded px-2 ${
                      contact.state === "WHITELIST"
                        ? "bg-green-300"
                        : "bg-red-300"
                    }`}
                  >
                    {contact.state === "WHITELIST" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="col-span-1 flex items-center">
                  <form
                    action=""
                    onSubmit={(event) => {
                      event.preventDefault();
                      changeContactState(contact.email, contact.state);
                    }}
                  >
                    <ActionButton
                      text={
                        contact.state === "WHITELIST"
                          ? "Blacklist user"
                          : "Make user active"
                      }
                      reqSent={processReq.contactState}
                      styles={`w-[100%] rounded h-[100%] text-white block p-2 ${
                        contact.state === "WHITELIST"
                          ? "bg-red-300 hover:bg-red-400"
                          : "bg-green-300 hover:bg-green-400"
                      }`}
                    />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Transition appear show={fileSeletion.fileSeleted} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Profile Picture
                  </Dialog.Title>
                  <div className="mt-2 ">
                    <img
                      src={image}
                      alt=""
                      className="w-[100%] h-[300px] object-cover"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeModal()}
                    >
                      cancel
                    </button>
                    <form action="" onSubmit={updateProfilePic}>
                      <ActionButton
                        text="save"
                        reqSent={processReq.profile}
                        styles="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      />
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserSettings;
