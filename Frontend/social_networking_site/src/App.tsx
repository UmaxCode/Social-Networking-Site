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

function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route>
        <Route path="/chats" element={<ChatContainer />}>
          <Route path=":chatId" element={<MessageSection />} />
        </Route>

        <Route path="user/">
          <Route path="user-profile" element={<></>} />
        </Route>
        <Route path="/" element={<AuthenticationWrapper />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
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
