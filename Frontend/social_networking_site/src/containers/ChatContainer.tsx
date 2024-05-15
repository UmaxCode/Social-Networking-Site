import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AuthData } from "../contexts/AuthWrapper";
import { Client, over } from "stompjs";
import { jwtDecode } from "jwt-decode";

export type ChatRoom = {
  chatId: string;
  online: boolean;
  senderEmail: string;
  receiverEmail: string;
};

type TokenData = {
  email: string;
  exp: number;
  iat: number;
  role: string;
  sub: string;
};

const ChatContainer = () => {
  const navigate = useNavigate();

  const connection = useRef<Client>();

  const [open, setOpen] = useState(false);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const [loggedInUser, setLoggedInUser] = useState<string>();

  const [newMessage, setNewMessage] = useState<number>();

  const params = useParams();

  const { logout, authenticate } = AuthData();

  function onConnected() {
    loadUserChatInfor();

    const decodedJWT: TokenData = jwtDecode(authenticate.token as string);

    const loggedInUser = decodedJWT.email;

    console.log("Logged In User");
    console.log(loggedInUser);

    setLoggedInUser(loggedInUser);

    connection.current?.subscribe(
      `/user/${loggedInUser}/queue/messages`,
      (payload) => {
        console.log("Message sent");

        const data = JSON.parse(payload.body);
        setNewMessage(data.id);
      }
    );

    connection.current?.subscribe(`/user/public`, loadUserChatInfor);

    connection.current?.send(
      "/app/user.online",
      {},
      JSON.stringify({ email: decodedJWT.email })
    );
  }

  function onError() {
    console.log("Error occurred while connecting to websocket");
  }

  async function loadUserChatInfor() {
    try {
      const response = await fetch(
        "http://localhost:3001/chatRooms",

        {
          method: "Get",
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: ChatRoom[] = await response.json();
      console.log(data);

      setChatRooms([...data]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!authenticate.isAuthenticated) {
      navigate("/");
    }

    const socket = new WebSocket("ws://localhost:3001/ws");

    const stompClient = over(socket);

    connection.current = stompClient;

    stompClient.connect({}, onConnected, onError);

    return () =>
      connection.current?.disconnect(() => {
        console.log("Disconnected from WebSocket server");
      });
  }, []);

  return (
    <>
      <div className="h-[100vh] overflow-hidden  bg-gray-100">
        <div className="sm:flex h-[100%] p-3 gap-3">
          <div className="h-[100%] sm:w-[30%]">
            <div className="h-[100%] rounded flex flex-col gap-3">
              <div className="bg-telegram-default p-2 rounded shadow-sm">
                <div className="flex justify-between items-center p-2">
                  <button onClick={() => setOpen(true)}>
                    <i className="bi bi-list text-2xl text-white"></i>
                  </button>

                  <div className="me-3 h-[30px] w-[30px]">
                    <img
                      src=""
                      alt=""
                      className="h-[100%] w-[100%] rounded-full"
                    />
                  </div>
                </div>
                <ChatInput
                  icon="bi bi-search px-2"
                  action={() => {}}
                  name="search"
                  placeholder="search"
                />
              </div>
              <div className="p-2 flex-1  bg-white overflow-y-scroll shadow-sm rounded">
                <div className="bg-white flex flex-col gap-2">
                  {chatRooms.length === 0 ? (
                    <>
                      <span className="text-center">
                        You have no friend(s) to chat with, check your blacklist
                        or Send an Invite
                        <i className="bi bi-send-plus-fill text-xl text-telegram-default"></i>
                      </span>
                    </>
                  ) : (
                    chatRooms.map((chat, index) => {
                      return (
                        <Chat
                          key={index}
                          chatid={chat.chatId}
                          full_name={chat.receiverEmail}
                          image=""
                          online={chat.online}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="sm:w-[70%] relative">
            <div
              className={`hidden absolute inset-0 sm:flex justify-center items-center rounded ${
                params.chatId ? "bg-transparent" : "bg-white"
              }`}
            >
              Select a chat to start messaging
            </div>
            <Outlet
              context={[
                newMessage,
                chatRooms,
                connection.current,
                loggedInUser,
              ]}
            />
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pe-3">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-[98%] top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-black-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 "
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Umaxconnect
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <Link
                          className="block hover:bg-blue-100 p-2 rounded"
                          to="../settings"
                        >
                          User Settings
                        </Link>

                        <Link
                          className="block hover:bg-blue-100 p-2 rounded mt-2"
                          to="../invites"
                        >
                          Invitations
                        </Link>

                        <button
                          className="w-[100%] mt-2 hover:bg-red-100 p-2 text-left rounded"
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ChatContainer;
