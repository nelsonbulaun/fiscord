import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Logout } from "./modals/Logout";
import ServerNavBar from "./components/ServerNavBar";
import { Chatbox } from "./components/ChatBox";
import DirectMessages from "./components/DirectMessages";
import Settings from "./pages/Settings";
import Server from "./components/Server";
import { Routes } from "react-router-dom";
import OriginalLayout from "./OriginalLayout";
import ProtectedRoute from "./ProtectedRoute";
import InvitePage from "./pages/InvitePage";
import { Friends } from "./pages/Friends";
import AddFriends from "./pages/AddFriends";

const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="fiscord" element={<OriginalLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="invite/:inviteCode" element={<InvitePage />} />
          <Route element={<ServerNavBar />}>
            <Route
              path=""
              element={<DirectMessages />}
              errorElement={<ErrorPage />}
            >
              <Route index element={<Friends />} errorElement={<ErrorPage />} />
              <Route path=":chatid" element={<Chatbox />} />
              <Route path="addfriends" element={<AddFriends />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="logout" element={<Logout />} />
            <Route path="servers/:serverid" element={<Server />}>
              <Route path=":chatid" element={<Chatbox />} />
            </Route>
            {/* <Route path="chats" element={<DirectMessages />}>
              <Route path=":chatid" element={<Chatbox />} />
              <Route path="friends" element={<Friends />} />
              <Route path="addfriends" element={<AddFriends />} />
            </Route> */}
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
  
export default Router;
