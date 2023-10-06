import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import ServerListProvider from "./context/ServerListContext.jsx";
import FriendsListProvider from "./context/FriendsListContext.jsx";
import NotificationListProvider from "./context/NotificationListContext.jsx";
import DirectMessageListProvider from "./context/DirectMessageListContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationListProvider>
        <ServerListProvider>
          <DirectMessageListProvider>
          <FriendsListProvider>
            <App />
          </FriendsListProvider>
          </DirectMessageListProvider>
        </ServerListProvider>
      </NotificationListProvider>
    </AuthProvider>
  </React.StrictMode>
);
