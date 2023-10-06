import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useAuth } from "./AuthContext";
const site = "https://fiscord.uw.r.appspot.com/servers/";
import io from "socket.io-client";
import { socket } from "../socket";
import { useNotificationList } from "./NotificationListContext";

const ServerListContext = createContext({
  serverList: [],
  setServerList: () => {},
});

export const useServerList = () => useContext(ServerListContext);

const ServerListProvider = ({ children }) => {
  // const { notificationList } = notificationList();
  const [serverList, setServerList] = useState([]);
  const { user } = useAuth();
  if (user){  console.log(user._id);}

  useEffect(() => {
    if (user) {
      const newServerList = async () => {
        try {
          Axios({
            method: "POST",
            data: {
              currentUserId: user._id,
            },
            withCredentials: true,
            url: site,
          }).then((res) => {
            setServerList(res.data);
            const servers = res.data;
            socket.on("server-must-update");
            servers.forEach((server) => {
              socket.emit("join_rooms", server._id);
              server.chats?.forEach((chat) => {
                socket.emit("join_rooms", chat._id);
              });
            });
          });
        } catch (error) {
          setServerList(null);
        }
      };
      newServerList();

     
    }
  }, [user, socket]);


  useEffect(() => {
    socket.on("server-must-update", (data) => {
      refreshData(data);
      console.log(data);
    });

    return () => {
      socket.off("server-must-update");
    }
  }, [user, socket]);

  const refreshData = async (val) => {
    Axios({
      method: "POST",
      data: {
        serverid: val,
      },
      withCredentials: true,
      url: "http://localhost:8080/server/get"
    }).then((res) => {
      console.log(res.data);
      setServerList((prevServerList=>prevServerList.map(listedserver => listedserver._id != res.data._id ? listedserver : res.data)));
        socket.emit("join_rooms", res.data._id);
        res.data?.chats?.forEach((chat) => {
          socket.emit("join_rooms", chat._id);
        });
    });
  };

  return (
    <ServerListContext.Provider value={{ serverList, setServerList }}>
      {children}
    </ServerListContext.Provider>
  );
};

export default ServerListProvider;
