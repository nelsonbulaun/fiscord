import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { useServerList } from "../context/ServerListContext";

export const LeaveServerModal = (props) => {
  const navigate = useNavigate();
  const server = props.server;
  const { serverList, setServerList } = useServerList();

  function handleSubmit() {
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/server/user/remove",
      data: {
        serverid: server._id,
        userid: props.userid,
      },
    }).then(() => {
      server.chats?.forEach((chat) => {
        socket.emit("leave_chat", chat._id);
        socket.emit("leave_rooms", chat._id);
      });
      setServerList((prevState) =>
        prevState.filter((server) => server._id != props.server._id)
      );
      socket.emit("server-update", server._id);
      navigate("/fiscord/", { replace: true });
    });
  }

  return (
    <div className="mx-full justify-center flex flex-col items-center">
      <div className="container rounded-lg shadow-sm flex flex-col justify-center p-4 items-center">
        <h1 className="pb-5">Are you sure you wish to leave the server?</h1>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <button
            className="px-6 pb-2 pt-2.5 outline-grey-900"
            onClick={handleSubmit}
          >
            Leave
          </button>
        </form>
      </div>
    </div>
  );
};
