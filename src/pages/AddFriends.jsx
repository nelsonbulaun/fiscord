import { Fragment, useState, useEffect } from "react";
import { socket } from "../socket";
import OtherUserTabs from "../components/OtherUserTabs";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useFriendsList } from "../context/FriendsListContext";
import { Link } from "react-router-dom";
import axios from "axios";

export const AddFriends = () => {
  const [search, setSearch] = useState();
  const [searchStarted, setSearchStarted] = useState(false);
  const [userList, setUserList] = useState([]);
  const { user } = useAuth();
  const [prefilteredData, setPrefilteredData] = useState([]);
  const navigate = useNavigate();
  const { friendsList, pendingRequests, setPendingRequests } = useFriendsList();
  const friendsListIds =
    friendsList != [] ? friendsList?.map((friend) => friend._id) : [];
  const pendingRequestsIds =
    pendingRequests != []
      ? pendingRequests?.outgoing?.map((friend) => friend._id)
      : [];
  const filteredIds = () => {
    switch (true) {
      case pendingRequestsIds.length > 0 && friendsListIds.length > 0:
        return [...friendsListIds, ...pendingRequestsIds, user._id];
      case pendingRequestsIds.length === 0 && friendsListIds.length > 0:
        return [...friendsListIds, user._id];
      case friendsListIds.length === 0 && pendingRequestsIds.length > 0:
        return [...pendingRequestsIds, user._id];
      default:
        return [user._id];
    }
  };

  function handleSearchChange(e) {
    setSearchStarted(true);
    setSearch(e.target.value);
    if (search) {
      axios.get("https://fiscord.uw.r.appspot.com/user/search/" + search).then((res) => {
        setPrefilteredData(res.data);
        const users = res.data;
        const filteredusers = prefilteredData.filter(
          (listeduser) => !filteredIds().includes(listeduser._id)
        );
        setUserList(filteredusers);
      });
    }
  }

  function addUser(val) {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/user/request/send",
      data: {
        currentUserId: user._id,
        userId: val,
      },
    }).then((res) => {
      const newPendingRequests = res.data.pending_requests;
      setPendingRequests(newPendingRequests);
      socket.emit("friendslist-changed", user._id, val);
      console.log(newPendingRequests);
      if (res.status === 200) {
        alert("friend request sent sucessfully");
      }
    });
  }

  return (
    <div className="h-full w-full">
      <div className="w-full bg-base-300/50 flex justify-between h-16 flex-none shadow-lg">
        <div className="mx-3 font-bold self-center"> Friends </div>
        <div className="self-center mx-3">
          <Link to="/chats/friends">Return To Friendslist</Link>
        </div>
      </div>
      <div className="mx-5 mt-5 font-bold text-left"> Add Friends </div>
      <div className="text-left mx-5">
        {" "}
        You can add your friends with their Fiscord username.{" "}
      </div>
      <form className="justify-self-start flex mt-3 ml-5">
        <input
          className="text-black break-after-auto w-1/4 min-h-6 min-w-50 rounded outline-grey-900 h-5 "
          placeholder="Search"
          onChange={handleSearchChange}
        />
      </form>
      <div className="flex flex-col ">
        {userList != [] && search != "" ? (
          <div className="mx-4 mb-4 mt-2">
            {userList?.map((otherUser) => (
              <Fragment key={otherUser._id}>
                <div className="flex flex-row divide-y">
                  <OtherUserTabs user={otherUser} />

                  <button onClick={() => addUser(otherUser._id)}>
                    Add Friend
                  </button>
                </div>
              </Fragment>
            ))}{" "}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AddFriends;
