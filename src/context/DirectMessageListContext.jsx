import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useAuth } from "./AuthContext";
const site = "https://fiscord.uw.r.appspot.com/chats/chat-messages";
import io from "socket.io-client";
import { socket } from "../socket";
import { useNotificationList } from "./NotificationListContext";

const DirectMessageListContext = createContext({
    directMessageList: null,
    setDirectMessageList: () => {},
});

export const useDirectMessageList = () => useContext(DirectMessageListContext);

const DirectMessageListProvider = ({ children }) => {
  // const { notificationList } = notificationList();
  const [directMessageList, setDirectMessageList] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newDirectMessageLIst = async () => {
        try {
          Axios({
            method: "POST",
            data: {
              currentUserId: user._id,
            },
            withCredentials: true,
            url: site,
          }).then((res) => {
            setDirectMessageList(res.data);
            console.log(res.data);
            const chats = res.data;
            chats?.forEach((chat) => {
            socket.emit("join_rooms", chat._id);
            });
          });
        } catch (error) {
            setDirectMessageList(null);
        }
      };
      newDirectMessageLIst();
    }
  }, [user]);

  return (
    <DirectMessageListContext.Provider value={{ directMessageList, setDirectMessageList }}>
      {children}
    </DirectMessageListContext.Provider>
  );
};

export default DirectMessageListProvider;
