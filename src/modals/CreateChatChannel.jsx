import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useServerList } from "../context/ServerListContext";
import { socket } from "../socket";

export const CreateChannel = ({server, chatList, setChatList}) => {
  const [channelName, setChannelName] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { serverList, setServerList } = useServerList();

  function handleChannelNameChange(e) {
    setChannelName(e.target.value);
  }

  function handleSubmit(e) {
    Axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/server/chat/create",
      data: {
        serverid: server._id,
        chat_name: channelName,
        serverUsers: server.users_involved,
      },
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.status === 200){
        alert("New Channel Created");
        const chatid = res.data._id
        socket.emit("server-update", server._id);
        socket.emit("channel-created", chatid);
        navigate("/fiscord/servers/"+ server._id +"/"+res.data._id);
        // console.log(serverList);
        setChatList([...chatList, res.data]);
        
      }
    });
  }

  return (
    <div className="mx-full justify-center flex flex-col items-center">
      <div
        id="register"
        className="container rounded-lg shadow-sm flex flex-col justify-center sm:py-12 items-center"
      >
        {/* <a href="/" className="text-3xl font-bold font-heading pb-20">
          {" "}
          Logo Here.{" "}
        </a> */}
        <h1 className="pb-5">Create a Channel</h1>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="text-white break-after-auto w-50 rounded outline-grey-900 m-2 p-1"
            placeholder="Channel Name"
            value={channelName}
            onChange={handleChannelNameChange}
          />

          <button
            className="px-6 pb-2 pt-2.5 outline-grey-900"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;