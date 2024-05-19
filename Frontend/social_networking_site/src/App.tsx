import {
  createBrowserRouter,
  Route,
  createRoutesFromChildren,
  RouterProvider,
} from "react-router-dom";
import AuthenticationWrapper from "./containers/AuthenticationWrapper";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import ChatContainer from "./containers/ChatContainer";
import ForgotPassword from "./components/ForgotPassword";
import MessageSection from "./components/MessageSection";
import UserSettings from "./components/UserSettings";
import Invitation from "./components/Invitation";
import WebSocketConnection from "./containers/WebSocketConnection";

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route>
        <Route path="/:user" element={<WebSocketConnection />}>
          <Route path="chats" element={<ChatContainer />}>
            <Route path=":chatId" element={<MessageSection />} />
          </Route>
          <Route path="settings" element={<UserSettings />} />
          <Route path="invites" element={<Invitation />} />
        </Route>
        <Route path="/" element={<AuthenticationWrapper />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<div>Page does not exit 404</div>} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
