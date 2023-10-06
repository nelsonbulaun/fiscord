import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useServerList } from "../context/ServerListContext";
import { socket } from "../socket";

export const ChangeServerName = ({server, setServerNameModalState}) => {
  const [serverName, setServerName] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { serverList, setServerList } = useServerList();

  function handleServerNameChange(e) {
    setServerName(e.target.value);
  }

  function handleSubmit(e) {
    Axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/server/name/change",
      data: {
        serverid: server._id,
        server_name: serverName,
      },
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.status === 200){
        alert("Server Name Changed");
        setServerList((prevServerList=>prevServerList.map(listedserver => listedserver._id != server._id ? listedserver : res.data)));
        console.log(serverList);
        navigate("/fiscord/servers/"+ res.data._id+"/"+res.data.chats[0]._id);
        // console.log(serverList);
        // setServerList([...serverList, res.data])
        setServerNameModalState(false);
        
      }
    });
  }

  return (
    <div className="mx-full justify-center flex flex-col items-center">
      <div
        id="register"
        className="container rounded-lg shadow-sm flex flex-col justify-center sm:py-12 items-center fit-content"
      >
      
        <h1 className="pb-5">Change Server Name</h1>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="text-white break-after-auto w-50 rounded outline-grey-900 m-2 p-1"
            placeholder="Channel Name"
            value={serverName}
            onChange={handleServerNameChange}
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

export default ChangeServerName;