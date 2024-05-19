import { Fragment, useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import avataImage from "../assets/avatar.jpg";
import { Dialog, Transition } from "@headlessui/react";
import { AuthData } from "../contexts/AuthWrapper";
import toast from "react-hot-toast";
import { WebSocketContextData } from "../containers/WebSocketConnection";
import ActionButton from "./ActionButton";
import backendEndpoints from "./endpoints";

type File = {
  fileSeleted: boolean;
  file: Blob;
};

type Message = {
  receiverEmail: string;
  senderEmail: string;
  content: string;
};

const MessageSection = () => {
  const { connection, userContacts, loggedInUser, newMessage } =
    WebSocketContextData();

  const [sendFileReq, setSendFileReq] = useState(false);

  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedContact = userContacts?.filter(
    (contact) => contact.email === params.chatId
  )[0];

  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const inputFile = useRef<HTMLInputElement>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { authenticate } = AuthData();

  const navigate = useNavigate();

  const [fileSeletion, setFilSelection] = useState<File>({
    fileSeleted: false,
    file: new Blob(),
  });

  useEffect(() => {
    if (newMessage !== undefined || newMessage !== null) {
      if (newMessage?.senderEmail === selectedContact?.email) {
        setChatMessages([...chatMessages, newMessage]);
      }
    }
    scrollToBottom();
  }, [newMessage]);

  async function loadUserMessages() {
    if (selectedContact) {
      const url = `${backendEndpoints.load_messages}${loggedInUser}/${selectedContact?.email}`;

      try {
        const response = await fetch(url, {
          method: "Get",
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        }

        const data = await response.json();

        setChatMessages([...data]);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message);
      } finally {
        scrollToBottom();
      }
    }
  }

  useEffect(() => {
    if (!authenticate.isAuthenticated) {
      navigate("/");
    }

    loadUserMessages();
  }, [selectedContact]);

  function sendMessage(data: string) {
    const blackListed = searchParams.get("blackListed");

    if (data?.trim().length === 0) {
      toast.error("You need to provide a message");
    } else if (data?.trim() && blackListed === "true") {
      toast.error("Sorry, you can't send a message to a blacklisted user");
    } else if (data?.trim() && connection) {
      const chatMessage = {
        senderEmail: loggedInUser,
        receiverEmail: selectedContact.email,
        content: data.trim(),
      };

      if (connection.connected) {
        connection.send("/app/chat", {}, JSON.stringify(chatMessage));
      }

      const newMessage: Message = {
        receiverEmail: chatMessage.receiverEmail,
        senderEmail: loggedInUser as string,
        content: data.trim(),
      };
      setChatMessages([...chatMessages, newMessage]);
    }

    scrollToBottom();
  }

  function sendFile(file: Blob) {
    setSendFileReq(true);
    setTimeout(() => {
      console.log(file);
      closeModal();
      setSendFileReq(false);
    }, 3000);
  }

  const openModal = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setFilSelection({
        ...fileSeletion,
        ["fileSeleted"]: true,
        ["file"]: file,
      });
    }
  };

  const closeModal = () => {
    setFilSelection({
      ...fileSeletion,
      ["fileSeleted"]: false,
      ["file"]: new Blob(),
    });
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  return (
    <>
      <div className=" h-[100%] rounded flex flex-col gap-3 bg-white sm:bg-transparent p-2 sm:p-0 sm:relative fixed inset-0 z-10">
        <div className="flex items-center bg-telegram-default sm:bg-white py-2 px-3 rounded shadow-sm">
          <Link to={`..`} className="sm:hidden">
            <i className="bi bi-arrow-left me-3 text-white"></i>
          </Link>
          <div className="me-3 h-[30px] w-[30px] relative">
            <img
              src={
                selectedContact?.profilePic
                  ? selectedContact?.profilePic
                  : avataImage
              }
              alt=""
              className="h-[100%] w-[100%] rounded-full"
            />
            <div
              className={`absolute h-[6px] w-[6px] ${
                selectedContact?.onlineStatus ? "bg-green-400" : "bg-gray-300"
              } rounded-full bottom-0 right-0`}
            ></div>
          </div>
          <div className="">
            <h3 className="sm:text-black text-white">
              {selectedContact?.email}
            </h3>
            <span className="text-[0.9em] sm:text-gray-400 text-white">
              {selectedContact?.onlineStatus ? "online" : "offline"}
            </span>
          </div>
        </div>
        <div
          className="flex-1 sm:bg-white bg-gray-100 rounded shadow-sm p-2 overflow-y-auto"
          ref={chatBoxRef}
        >
          {chatMessages?.map((message, index) => {
            return (
              <div key={index} className="">
                <div
                  className={`${
                    loggedInUser === message?.senderEmail
                      ? "text-right"
                      : "text-left"
                  }  mb-2`}
                >
                  <span
                    className={`${
                      loggedInUser === message?.senderEmail
                        ? "bg-telegram-light text-white rounded-bl-lg"
                        : "sm:bg-gray-100 bg-white  text-telegram rounded-br-lg"
                    }  mb-2 inline-block p-2 rounded-t-lg `}
                  >
                    {message?.content}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="">
          <div className="flex items-center">
            <input
              ref={inputFile}
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={openModal}
            />
            <button
              className="bg-white shadow text-telegram-default bi bi-paperclip py-2 px-2 me-1 rounded"
              onClick={() => {
                if (inputFile.current != null) {
                  inputFile.current.click();
                }
              }}
            ></button>

            <div className="flex-1">
              <ChatInput
                clearInput={true}
                icon="bi bi-send-fill px-2 bg-telegram-default text-white rounded"
                action={sendMessage}
                name="chat_message"
                placeholder="write a message"
              />
            </div>
          </div>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Send File
                  </Dialog.Title>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 flex">
                      <i className="bi bi-file-earmark-arrow-up-fill text-telegram-default text-xl me-1"></i>
                      <span>
                        <p>{fileSeletion.file && fileSeletion.file.name}</p>
                        <p>
                          {fileSeletion.file &&
                            (fileSeletion.file.size / 1024).toFixed(2)}{" "}
                          KB
                        </p>
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeModal()}
                    >
                      cancel
                    </button>
                    <form
                      action=""
                      onSubmit={(event) => {
                        event.preventDefault();
                        sendFile(fileSeletion.file);
                      }}
                    >
                      <ActionButton
                        text="save"
                        reqSent={sendFileReq}
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

export default MessageSection;
