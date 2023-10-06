import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useServerList } from "../context/ServerListContext";
import { socket } from "../socket";

export default function InvitePage(){
    const {inviteCode} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [serverInfo, setServerInfo] = useState();
    const { user } = useAuth();
    const navigate = useNavigate();
    const {serverList, setServerList} = useServerList();

    if (serverInfo && serverInfo.users_involved.includes(user._id)){
      navigate("/servers/"+ serverInfo._id+"/"+serverInfo.chats[0]._id)
    }


    function handleSubmit(){
        axios({
            method:"POST",
            url:"http://127.0.0.1:8080/server/user/add",
            data:{
                serverid: serverInfo._id,
                userid: user._id
            }
        }).then(()=>{
          setServerList([...serverList, serverInfo]);
          const chat = serverInfo.chats[0];
          serverInfo.chats?.forEach((serverChat) => {
            socket.emit("join_rooms", serverChat._id);
            socket.emit("join_chat", serverChat._id);
          });
          socket.emit("server-update", serverInfo._id); 
          const url = "/servers/" + serverInfo._id + "/" + serverInfo.chats[0]._id;
          navigate(url);
         
        });
    }

    useEffect(()=>{
        axios.get( `http://127.0.0.1:8080/server/${inviteCode}`).
        then((res)=>{
            const server = res.data;
            console.log(`http://127.0.0.1:8080/server/${inviteCode} `)
            setServerInfo(res.data)
            console.log(res.data);
            setIsLoading(false);
        });

    },[inviteCode])

    const render = () => {
        if (isLoading)
          return <span className="loading loading-spinner loading-md"></span>;

    return(
        <>
         <div className="mx-full justify-center flex flex-col items-center">
      <div
        id="register"
        className="container rounded-lg shadow-sm backdrop-blur flex flex-col justify-center sm:py-12 items-center"
      >
        <a href="/" className="text-3xl font-bold font-heading pb-20">
          {" "}
          Logo Here.{" "}
        </a>
        <h1 className="pb-5">You've been invited to join</h1>
        <div>{serverInfo?.server_name} </div>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <button
            className="px-6 pb-2 pt-2.5 outline-grey-900"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
        </>
    );

};
return render();
}