import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import OtherUserTabs from "./OtherUserTabs";
import { useAuth } from "../context/AuthContext";
import UserTab from "./UserTab";
import { UserPopUp } from "./UserPopUp";

export default function DirectMessages() {
  const [chatList, setChatList] = useState();
  // const [isLoading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios({
      method: "POST",
      data: {
        currentUserId: user._id,
      },
      url: "https://fiscord.uw.r.appspot.com/chats/chat-messages",
      withCredentials: true,
    }).then((res) => {
      const chats = res.data;
      console.log(res);
      setChatList(chats);
      // setLoading(false);
    });
  }, [user]);

  // const render = () => {
  //   if (isLoading)
  //     return <span className="loading loading-spinner loading-md"></span>;

    return (
      <div className="w-full h-full">
        {/* top bar */}
        <div className="h-full w-full flex overflow-hidden bg-base-100/50 rounded-l-xl outline outline-white/10 outline-1">
          <div
            id="chatList"
            className="flex flex-col p-0 w-60 rounded-l-lg min-h-full bg-base-300/40 text-base-content"
          >
            <div className="grid">  <div className="text-left font-bold px-3 py-4 mt-2">
                
                <NavLink to="/fiscord/"> Friends </NavLink>
              </div>
              </div>
            <div className="flex flex-col grow w-full">
              <p className="text-left text-xs font-bold pt-4 pl-2 pb-2 uppercase">
                {" "}
                Direct Messages
              </p>
              {chatList?.map((chat) => (
                <>
                  <Link to={"/fiscord/" + chat._id}>
                    <div className="leading-normal w-full px-2">
                      {/* {chat.chat_name} */}

                      {chat.users_involved.map((otheruser) =>
                        otheruser._id != user._id ? (
                          <OtherUserTabs user={otheruser} />
                        ) : (
                          <></>
                        )
                      )}
                    </div>
                  </Link>
                </>
              ))}
            </div>
      
            <div className="w-full grid items-center h-16 self-end flex-none bg-base-300/40">
              <UserPopUp user={user}/>
            </div>
          </div>

          <div id="chatboxoutlet">
            {/* <div id="chatboxoutlet" className="grow h-full"> */}
            <Outlet />
          </div>
        </div>
      </div>
    );
  };
//   return render();
// }
