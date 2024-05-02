import { Fragment, useState, useRef } from "react";
import ChatInput from "./ChatInput";
import { Link, useOutletContext } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

const MessageSection = () => {
  const chat = useOutletContext();
  console.log(chat);

  const inputFile = useRef(null);

  const [fileSeletion, setFilSelection] = useState({
    fileSeleted: false,
    file: null,
  });

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
      ["file"]: null,
    });
  };
  return (
    <>
      <div className=" h-[100%] rounded flex flex-col gap-3 bg-white sm:bg-transparent p-2 sm:p-0 sm:relative fixed inset-0 z-10">
        <div className="flex items-center bg-telegram-default sm:bg-white py-2 px-3 rounded shadow-sm">
          <Link to={`/chats`} className="sm:hidden">
            <i className="bi bi-arrow-left me-3 text-white"></i>
          </Link>
          <div className="me-3 h-[30px] w-[30px] relative">
            <img src="" alt="" className="h-[100%] w-[100%] rounded-full" />
            <div
              className={`absolute h-[6px] w-[6px] ${
                chat.status ? "bg-green-400" : "bg-gray-300"
              } rounded-full bottom-0 right-0`}
            ></div>
          </div>
          <div className="">
            <h3 className="sm:text-black text-white">{chat.receiver}</h3>
            <span className="text-[0.9em] sm:text-gray-400 text-white">
              {chat.status ? "online" : "offline"}
            </span>
          </div>
        </div>
        <div className="flex-1 sm:bg-white bg-gray-100 rounded shadow-sm p-2 overflow-y-auto">
          <div className="">
            {chat.messages.map((mes, index) => {
              return (
                <div key={index}>
                  <p>{mes.sender}</p>
                  <p className="text-right">{mes.receiver}</p>
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
                action={() => {}}
                name="search"
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