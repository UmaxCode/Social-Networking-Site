const ChatContainer = () => {
  return (
    <div className="h-[100vh] bg-white">
      <div className="desktop hidden sm:flex h-[100%] p-3">
        <div className="w-[30%] ">
          <div className="">
            <h3>Messenger</h3>
            <p>Chats</p>
            <p>search</p>
            <div className=""></div>
          </div>
        </div>
        <div className="w-[70%]">
          <div className="bg-gray-100 h-[100%] rounded">dfd</div>
        </div>
      </div>
      <div className="mobile sm:hidden">dfdf</div>
    </div>
  );
};

export default ChatContainer;
