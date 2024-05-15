import { Fragment, useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import {
  Link,
  useOutletContext,
  useNavigate,
  useParams,
} from "react-router-dom";
import avataImage from "../assets/avatar.jpg";
import { Dialog, Transition } from "@headlessui/react";
import { ChatRoomResponse } from "../containers/ChatContainer";
import { AuthData } from "../contexts/AuthWrapper";
import { Client } from "stompjs";

type File = {
  fileSeleted: boolean;
  file: Blob;
};

type Message = {
  chatId: string;
  senderEmail: string;
  content: string;
};

const MessageSection = () => {
  const [newMessage, chatRooms, connection, loggedInUser] =
    useOutletContext<[string, ChatRoomResponse[], Client, string]>();

  const params = useParams();

  const selectedChatRoom = chatRooms.filter(
    (chatRoom) => chatRoom.chatRoom.chatId === params.chatId
  )[0];

  console.log(selectedChatRoom);

  const [chatMessages, setChatMessages] = useState<Message[]>();

  const inputFile = useRef<HTMLInputElement>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { authenticate } = AuthData();

  const navigate = useNavigate();

  const [messageToggle, setMessageToggle] = useState<boolean>();

  const [fileSeletion, setFilSelection] = useState<File>({
    fileSeleted: false,
    file: new Blob(),
  });

  async function loadUserMessages() {
    if (selectedChatRoom) {
      const url = `http://localhost:3001/messages/${selectedChatRoom.chatRoom.senderEmail}/${selectedChatRoom.chatRoom.receiverEmail}`;

      try {
        const response = await fetch(url, {
          method: "Get",
          headers: {
            Authorization: `Bearer ${authenticate.token}`,
          },
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setChatMessages([...data]);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (!authenticate.isAuthenticated) {
      navigate("/");
    }

    loadUserMessages().then(() => scrollToBottom());
  }, [selectedChatRoom, messageToggle, newMessage]);

  function sendMessage(data: string) {
    if (data?.trim() && connection) {
      const chatMessage = {
        chatId: selectedChatRoom.chatRoom.chatId,
        senderEmail: selectedChatRoom.chatRoom.senderEmail,
        receiverEmail: selectedChatRoom.chatRoom.receiverEmail,
        content: data.trim(),
      };

      connection.send("/app/chat", {}, JSON.stringify(chatMessage));

      setMessageToggle(!messageToggle);
    }
  }

  function sendFile(file: Blob) {
    return null;
  }

  const openModal = (event: any) => {
    console.log("Open file");
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
                selectedChatRoom?.receiver_profile
                  ? selectedChatRoom?.receiver_profile
                  : avataImage
              }
              alt=""
              className="h-[100%] w-[100%] rounded-full"
            />
            <div
              className={`absolute h-[6px] w-[6px] ${
                selectedChatRoom?.chatRoom.online
                  ? "bg-green-400"
                  : "bg-gray-300"
              } rounded-full bottom-0 right-0`}
            ></div>
          </div>
          <div className="">
            <h3 className="sm:text-black text-white">
              {selectedChatRoom?.chatRoom.receiverEmail}
            </h3>
            <span className="text-[0.9em] sm:text-gray-400 text-white">
              {selectedChatRoom?.chatRoom.online ? "online" : "offline"}
            </span>
          </div>
        </div>
        <div
          className="flex-1 sm:bg-white bg-gray-100 rounded shadow-sm p-2 overflow-y-auto"
          ref={chatBoxRef}
        >
          <div className="">
            {chatMessages?.map((message, index) => {
              return (
                <div key={index} className="">
                  <div
                    className={`${
                      loggedInUser === message.senderEmail
                        ? "text-right"
                        : "text-left"
                    }  mb-2`}
                  >
                    <span
                      className={`${
                        loggedInUser === message.senderEmail
                          ? "bg-telegram-light text-white rounded-bl-lg"
                          : "sm:bg-gray-100 bg-white  text-telegram rounded-br-lg"
                      }  mb-2 inline-block p-2 rounded-t-lg `}
                    >
                      {message.content}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => closeModal()}
                    >
                      Send
                    </button>
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
