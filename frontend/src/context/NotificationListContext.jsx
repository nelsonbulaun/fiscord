import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useAuth } from "./AuthContext";
const site = "https://fiscord.uw.r.appspot.com/servers/";
import io from "socket.io-client";
import { socket } from "../socket";

const NotificationListContext = createContext({
  notificationList: null,
  setNotificationList: () => {},
  incrementCounter: () => {},
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotificationList = () => useContext(NotificationListContext);

const NotificationListProvider = ({ children }) => {
  const [notificationList, setNotificationList] = useState([]);
  
  const incrementCounter = (chatId) => {
    let idInNotifications = notificationList.find((notification) => notification.id === chatId)
    if (idInNotifications) {
      setNotificationList((prevNotificationList) =>
        prevNotificationList.map((notification) =>
          notification.id === chatId
            ? { ...notification, counter: notification.counter + 1 }
            : notification
        )
      );
    } else {
      const newNotification = { id: chatId, counter: 1 };
      setNotificationList((prevNotificationList) => [
        ...prevNotificationList,
        newNotification,
      ]);
    }
  };

  const addNotification = (notificationid) => {
    const newNotification = { id: notificationid, counter: 0 };
    setNotificationList((prevNotificationList) => [
      ...prevNotificationList,
      newNotification,
    ]);
  };

  const removeNotification = (notificationid) => {
    setNotificationList((prevNotificationList) =>
      prevNotificationList.filter(
        (notification) => notification.id !== notificationid
      )
    );
  };

  return (
    <NotificationListContext.Provider
      value={{
        notificationList,
        setNotificationList,
        incrementCounter,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationListContext.Provider>
  );
};

export default NotificationListProvider;
