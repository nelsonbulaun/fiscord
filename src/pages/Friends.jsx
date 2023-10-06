import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import OtherUserTabs from "../components/OtherUserTabs";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, NavLink, Link } from "react-router-dom";
import { socket } from "../socket";
import { useFriendsList } from "../context/FriendsListContext";

export const Friends = () => {
  const [search, setSearch] = useState();
  const [searchStarted, setSearchStarted] = useState(false);
  const [userList, setUserList] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { friendsList, setFriendsList, pendingRequests, setPendingRequests } =
    useFriendsList();

  function handleSearchChange(e) {
    setSearchStarted(true);
    setSearch(e.target.value);
    if (search) {
      axios.get("https://fiscord.uw.r.appspot.com/user/search/" + search).then((res) => {
        const users = res.data;
        setUserList(users);
      });
    }
  }

  function acceptUser(val) {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/user/request/accept",
      data: {
        currentUserId: user._id,
        userId: val,
      },
    }).then((res) => {
      const newFriendsList = res.data;
      setFriendsList(newFriendsList.friends);
      setPendingRequests(newFriendsList.pending_requests);
      socket.emit("friendslist-changed", user._id, val);
      console.log(res.data);
    });
  }

  function removeUser(val) {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/user/friend/remove",
      data: {
        currentUserId: user._id,
        userId: val,
      },
    }).then((res) => {
      const newFriendsList = res.data;
      setFriendsList(newFriendsList.friends);
      console.log(res.data);
      socket.emit("friendslist-changed", user._id, val);
    });
  }
  function cancelRequest(val) {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/user/request/cancel",
      data: {
        currentUserId: user._id,
        userId: val,
      },
    }).then((res) => {
      const newFriendsList = res.data;
      setPendingRequests(newFriendsList.pending_requests);
      socket.emit("friendslist-changed", user._id, val);
      console.log(res.data);
    });
  }
  function messageUser(val) {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/chats/direct-messages",
      data: {
        currentUserId: user._id,
        userId: val,
      },
    }).then((res) => {
      if (res.data != null && res.data != []) {
        const prevChat = res.data;
        console.log(res.data);
        navigate("/chats/" + prevChat._id);
      } else {
        axios({
          method: "POST",
          url: "https://fiscord.uw.r.appspot.com/chat/create",
          data: {
            currentUserId: user._id,
            userid: val,
            chat_type: "direct_message",
          },
        }).then((res) => {
          const chat = res.data;
          socket.emit("channel-created", chat._id);
          navigate("/chats/" + chat._id);
        });
      }
    });
  }

  return (
    <div className="h-full w-full">
      <div className="w-full bg-base-300/50 flex justify-between align-center h-16 flex-none shadow-lg">
        <div className="mx-3 font-bold self-center"> Friends </div>
        <div className="self-center mx-3">
          <Link to="/chats/addfriends">Add Friends</Link>
        </div>
      </div>

      <div className="flex flex-col ">
        <div className="mx-4 mb-4 mt-2">
          <h1 className="text-left font-bold ml-1 m-3">Friends:</h1>
          {friendsList?.map((friend, index) => (
            <Fragment key={index}>
              <div className="flex flex-row justify-between align-center hover:bg-base-300/75">
                <OtherUserTabs user={friend} />
                <div className="items-center self-center">
                  <button
                    className="mx-2"
                    value={friend._id}
                    onClick={() => messageUser(friend._id)}
                  >
                    Message
                  </button>
                  <button
                    value={friend._id}
                    onClick={() => removeUser(friend._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
          {pendingRequests != [] ? (
            <h1 className="text-left font-bold ml-1 m-3">Pending Requests:</h1>
          ) : (
            <></>
          )}
          {pendingRequests?.incoming != [] ? (
            <h1 className="text-left font-bold ml-1 m-3">Incoming:</h1>
          ) : (
            <></>
          )}
          {pendingRequests?.incoming?.map((pendingUser) => (
            <Fragment key={pendingUser._id}>
              <div className="flex flex-row justify-between align-center">
                <OtherUserTabs user={pendingUser} />

                <button
                  value={pendingUser._id}
                  onClick={(e) => acceptUser(e.target.value)}
                >
                  Accept Request
                </button>
              </div>
            </Fragment>
          ))}
          {pendingRequests?.outgoing != [] ? (
            <h1 className="text-left font-bold ml-1 m-3">Outgoing:</h1>
          ) : (
            <></>
          )}
          {pendingRequests?.outgoing?.map((pendingUser, index) => (
            <Fragment key={index}>
              <div className="flex flex-row justify-between align-center">
                <OtherUserTabs user={pendingUser} />
                <button
                  value={pendingUser._id}
                  onClick={(e) => cancelRequest(e.target.value)}
                >
                  Cancel Request
                </button>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Friends;
