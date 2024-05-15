import { useEffect, useState, Fragment } from "react";
import { AuthData } from "../contexts/AuthWrapper";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ActionButton from "./ActionButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Toggle from "./Toggle";

type PlatformUsers = {
  nonInviteUsers: [];
  invites: Invite[];
};

type Invite = {
  from: string;
};

type UpdateInvite = {
  sent: boolean;
  accepted: boolean;
  declined: boolean;
};

const Invitation = () => {
  const [platformUsers, setPlatFormUsers] = useState<PlatformUsers>();

  const [inviteUpdated, setInviteUpdated] = useState<UpdateInvite>({
    sent: false,
    accepted: false,
    declined: false,
  });

  const [enabled, setEnabled] = useState(false);

  const toggleSwitch = () => {
    setEnabled((prevState) => !prevState);
  };

  const navigate = useNavigate();

  const [processReq, setProcessReq] = useState({
    send: false,
    accept: false,
    deleted: false,
  });

  const [firstSelection, setFirstSelection] = useState("select a user");

  const [secondSelection, setSecondSelection] = useState("select a user");

  const { authenticate } = AuthData();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  console.log(enabled);

  useEffect(() => {
    if (!authenticate.isAuthenticated) {
      navigate("/");
      return;
    }
    console.log("Updating..............");
    async function loadUserInvitations() {
      try {
        const response = await fetch(
          "http://localhost:3001/user/list/invitation",
          {
            method: "Get",
            headers: {
              Authorization: `Bearer ${authenticate.token}`,
            },
          }
        );

        console.log(response);

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();

        console.log(data);

        setPlatFormUsers(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadUserInvitations();
  }, [inviteUpdated.accepted, inviteUpdated.sent, inviteUpdated.declined]);

  const sendInvite = (email: string) => {
    if (email === "select a user") {
      toast.error("Please select a user");
      return;
    }
    setProcessReq({ ...processReq, ["send"]: true });
    async function send() {
      try {
        const response = await fetch("http://localhost:3001/user/send_invite", {
          method: "Post",
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        console.log(response);

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();

        console.log(data);

        setProcessReq({ ...processReq, ["send"]: false });
        toast.success(data.message);
        setInviteUpdated({ ...inviteUpdated, ["sent"]: true });
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
        console.log(error);
        setProcessReq({ ...processReq, ["send"]: false });
      } finally {
        setInviteUpdated({ ...inviteUpdated, ["sent"]: true });
      }
    }

    send();
  };

  const accepOrDeclinetInvite = (email: string) => {
    if (email === "select a user") {
      toast.error("Please select a user");
      return;
    }

    setProcessReq({ ...processReq, ["accept"]: true });

    const url = enabled
      ? "http://localhost:3001/user/accept_invite"
      : "http://localhost:3001/user/decline_invite";

    const method = enabled ? "Post" : "Delete";

    async function acceptOrDecline() {
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();
        setProcessReq({ ...processReq, ["send"]: false });

        toast.success(data.message);
      } catch (error) {
        const err = error as Error;
        setProcessReq({ ...processReq, ["send"]: false });
        toast.error(err.message);
        console.log(error);
      } finally {
        setInviteUpdated({ ...inviteUpdated, ["accepted"]: true });
      }
    }

    acceptOrDecline();
  };
  return (
    <div className="">
      <div className="bg-telegram-default text-white p-3 text-xl uppercase mb-8">
        <i className="bi bi-folder-symlink me-2"></i>
        Invitations
      </div>

      <div className="max-w-[800px] mx-auto ">
        <h2 className="text-center bg-blue-100 rounded mb-3">Send Invites</h2>

        <form
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            sendInvite(firstSelection);
          }}
        >
          <div className="flex  gap-3 mb-8 items-center mt-4">
            <div className="flex-1 ">
              <Listbox value={firstSelection} onChange={setFirstSelection}>
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-telegram-default sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <i className="bi bi-person-fill-add h-5 w-5 flex-shrink-0 rounded-full"></i>
                          <span className="ml-3 block truncate">
                            {firstSelection}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {platformUsers?.nonInviteUsers
                            ? platformUsers.nonInviteUsers.map(
                                (person, index) => (
                                  <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-telegram-light text-white"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={person}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <i className="bi bi-person-fill-add h-5 w-5 flex-shrink-0 rounded-full"></i>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "ml-3 block truncate"
                                            )}
                                          >
                                            {person}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-telegram-light",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )
                              )
                            : ""}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="">
              <ActionButton
                text="Send Invite"
                reqSent={processReq.send}
                styles="bg-green-300 text-white px-2 py-1 rounded hover:bg-green-400"
              />
            </div>
          </div>
        </form>
        <h2 className="text-center bg-blue-100 rounded mb-3">
          Invitations From Other Users
        </h2>
        <form
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            accepOrDeclinetInvite(secondSelection);
          }}
        >
          <div className="flex  gap-3 mb-8 items-center">
            <div className="flex-1 ">
              <Listbox value={secondSelection} onChange={setSecondSelection}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-telegram-default sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <i className="bi bi-person-fill-add h-5 w-5 flex-shrink-0 rounded-full"></i>
                          <span className="ml-3 block truncate">
                            {secondSelection}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {platformUsers?.invites
                            ? platformUsers.invites.map((invite, index) => (
                                <Listbox.Option
                                  key={index}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "bg-telegram-light text-white"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={invite.from}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div className="flex items-center">
                                        <i className="bi bi-person-fill-add h-5 w-5 flex-shrink-0 rounded-full"></i>
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "ml-3 block truncate"
                                          )}
                                        >
                                          {invite.from}
                                        </span>
                                      </div>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-telegram-light",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))
                            : ""}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="flex items-center gap-2">
              <Toggle enabled={enabled} toggleSwitch={toggleSwitch} />
              <ActionButton
                text={`${enabled ? "Accept" : "Decline"}`}
                reqSent={processReq.accept}
                styles={` ${
                  enabled
                    ? "bg-green-300 hover:bg-green-400"
                    : "bg-red-300 hover:bg-red-400"
                }  text-white px-2 py-1 rounded `}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invitation;
