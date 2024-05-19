import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState, useRef, createContext, useContext } from "react";
import { AuthData } from "../contexts/AuthWrapper";
import { Client, over } from "stompjs";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import backendEndpoints from "../components/endpoints";

type TokenData = {
  email: string;
  exp: number;
  iat: number;
  role: string;
  sub: string;
};

export type UserContact = {
  fullname: string;
  email: string;
  onlineStatus: boolean;
  profilePic: string;
  blackListed: boolean;
};

export type Message = {
  receiverEmail: string;
  senderEmail: string;
  content: string;
};

type ContextValue = {
  connection: Client | null;
  userContacts: UserContact[];
  loggedInUser: string | null;
  newMessage: Message | null;
  loadUserContacts: () => void;
};

const initialContextValue: ContextValue = {
  connection: null,
  userContacts: [],
  loggedInUser: null,
  newMessage: null,
  loadUserContacts: () => {},
};

const connectionContext = createContext(initialContextValue);

export const WebSocketContextData = () => useContext(connectionContext);

const WebSocketConnection = () => {
  const navigate = useNavigate();

  const connection = useRef<Client | null>();

  const [userContacts, setUserContacts] = useState<UserContact[]>([]);

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const { authenticate } = AuthData();

  function onConnected() {
    const decodedJWT: TokenData = jwtDecode(authenticate.token as string);

    const loggedInUser = decodedJWT.email;

    connection.current?.subscribe(
      `/user/${loggedInUser}/queue/messages`,
      (payload) => {
        const data = JSON.parse(payload.body);

        if (data.chatId === null || data.chatId === undefined) {
          toast.error(data.content);
          return;
        }
        const receiverEmail = data.chatId
          .split("_")
          .filter((email: string) => email != data.senderEmail)[0];

        setNewMessage({
          ...newMessage,
          receiverEmail: receiverEmail,
          senderEmail: data.senderEmail,
          content: data.content,
        });
      }
    );

    connection.current?.subscribe(`/user/public`, loadUserContacts);

    if (connection.current?.connected) {
      connection.current?.send(
        "/app/user.online",
        {},
        JSON.stringify({ email: decodedJWT.email })
      );
      setLoggedInUser(loggedInUser);
      loadUserContacts();
    }
  }

  function onError() {
    console.log("Error occurred while connecting to websocket");
  }

  async function loadUserContacts() {
    try {
      const response = await fetch(
        backendEndpoints.user_contacts,

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

      const data: UserContact[] = await response.json();
      console.log(data);

      setUserContacts([...data]);
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

  const contextValue: ContextValue = {
    connection: connection.current as Client,
    userContacts,
    loggedInUser,
    newMessage,
    loadUserContacts,
  };

  return (
    <div>
      <connectionContext.Provider value={contextValue}>
        {connection.current?.connected ? (
          <Outlet />
        ) : (
          <div>Connecting to web socket ....</div>
        )}
      </connectionContext.Provider>
    </div>
  );
};

export default WebSocketConnection;
