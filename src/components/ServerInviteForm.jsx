import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useServerList } from "../context/ServerListContext";

export const ServerInviteForm   = () => {
  const [serverName, setServerName] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();


  function handleSubmit(e) {
    Axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/user/servers/add",
      data: {
        server: serverName,
        userid: user._id,
      },
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.status === 200){
        alert("Server Created");
        navigate("/fiscord/servers/"+res.data._id);
        console.log(serverList);
        
      }
    });
  }

  return (
    <div className="mx-full justify-center flex flex-col items-center">
      <div
        id="register"
        className="container rounded-lg shadow-sm backdrop-blur flex flex-col justify-center sm:py-12 items-center"
      >
        <a href="/" className="text-3xl font-bold font-heading pb-20">
          {" "}
          Logo Here.{" "}
        </a>
        <h1 className="pb-5">You've been invited to join </h1>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>Click here to accept your invite!</div>
          <button
            className="px-6 pb-2 pt-2.5 outline-grey-900"
            onClick={handleSubmit}
          >
            JOIN!
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServerInviteForm;