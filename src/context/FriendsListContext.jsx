import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useAuth } from "./AuthContext";
const site = "https://fiscord.uw.r.appspot.com/user/friends";
import io from "socket.io-client";
import { socket } from "../socket";

const FriendsListContext = createContext({
  friendsList: [],
  setFriendsList: () => {},
  pendingRequests: [],
  setPendingRequests: () => {},
});

export const useFriendsList = () => useContext(FriendsListContext);

const FriendsListProvider = ({ children }) => {
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newFriendsList = async () => {
        try {
          Axios({
            method: "POST",
            data: {
              currentUserId: user._id,
            },
            withCredentials: true,
            url: site,
          }).then((res) => {
            const friends = res.data.friends;
            setFriendsList(friends);
            setPendingRequests(res.data.pending_requests);
            socket.on("logged-in");
            socket.on("logged-off");
            friends?.forEach((friend) => {
              socket.emit("join_rooms", friend._id);
            });
          });
        } catch (error) {
          setFriendsList(null);
        }
      };
      newFriendsList();
    }
  }, [user, socket]);

  useEffect(() => {
    if (user) {
    socket.on("friendslist-changed-occurred", () => {
      refreshData(user._id);
    });
    socket.on("logged-in", () => {
      refreshData(user._id);
    });
    socket.on("logged-off", () => {
      refreshData(user._id);
    });

    return () => {
      socket.off("friendslist-changed-occurred");
      socket.off("logged-in");
      socket.off("logged-off");
    }
}}, [user, socket]);

  const refreshData = async (val) => {
    Axios({
      method: "POST",
      data: {
        currentUserId: val,
      },
      withCredentials: true,
      url: site,
    }).then((res) => {
      const friends = res.data.friends;
      setFriendsList(friends);
      setPendingRequests(res.data.pending_requests);
    });
  };

  return (
    <FriendsListContext.Provider
      value={{
        friendsList,
        setFriendsList,
        pendingRequests,
        setPendingRequests,
      }}
    >
      {children}
    </FriendsListContext.Provider>
  );
};

export default FriendsListProvider;
