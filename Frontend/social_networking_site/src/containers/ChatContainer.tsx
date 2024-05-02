import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";
import { usersData } from "../assets/data/data";
import { Outlet, useParams } from "react-router-dom";

const ChatContainer = () => {
  const params = useParams();
  const index = params.chatId;

  const chat = usersData[index];

  return (
    <>
      <div className="h-[100vh] overflow-hidden  bg-gray-100">
        <div className="sm:flex h-[100%] p-3 gap-3 max-w-[1500px] mx-auto">
          <div className="h-[100%] sm:w-[30%]">
            <div className="h-[100%] rounded flex flex-col gap-3">
              <div className="bg-white p-2 rounded shadow-sm">
                <div className="flex justify-between items-center p-2">
                  <h3 className="mb-2">Chats</h3>
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
                />
              </div>
              <div className="p-2 flex-1  bg-white overflow-y-scroll shadow-sm rounded">
                <div className="bg-white  ">
                  {usersData.map((chat) => {
                    return (
                      <Chat
                        key={chat.chatId}
                        chatid={chat.chatId}
                        full_name={chat.receiver}
                        last_message={chat.lastMessage}
                        time={chat.time}
                        image=""
                        status={chat.status}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="sm:w-[70%] relative">
            <div
              className={`hidden absolute inset-0 sm:flex justify-center items-center rounded ${
                chat ? "bg-transparent" : "bg-white"
              }`}
            >
              Select a chat to start messaging
            </div>
            <Outlet context={chat} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
