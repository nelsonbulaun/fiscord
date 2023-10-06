import React from "react";
import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { RenderMessages } from "./RenderMessage";
import io from "socket.io-client";
import { socket } from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Notify }  from "./NewMessage";
import { useNotificationList } from "../context/NotificationListContext";
import { OtherUserPopUp } from "./OtherUserPopUp";


export const Chatbox = () => {
  let { chatid } = useParams();
  const { user } = useAuth();
  const [chatValues, setChatValues] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [usersInvolved, setUsersInvolved] =useState([]);
  const [textBox, setTextBox] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [typer, setTyper] = useState("");
  const { notificationList, setNotificationList, incrementCounter, addNotification, removeNotification } = useNotificationList();
  const [isTyping, setIsTyping] = useState("false");
  
  function usertyping (){
    socket.emit("user-typing", user.username, chatid)}

  function userstoppedtyping(){
    socket.emit("user-stopped-typing", user.username, chatid);
  }

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function handleTextBoxChange(e) {
    usertyping();
    setTimeout(() => {userstoppedtyping() }, 1000);
    setTextBox(e.target.value);
  }

  function handleSubmit(e) {
    axios({
      method: "POST",
      data: {
        currentUser: user._id,
        message_content: textBox,
        chatid: chatid,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/send-message",
    }).then((res) => {
      if (res.status === 200) {
        console.log(res);
        const newmessage = res.data;
        socket.emit("send-message-channel", newmessage, chatid);
        setTextBox("");
      }
    });
  }

  useEffect(() => {
    const data = (message, channel_id) => {
      if (channel_id === chatid){
        setMessageList((messageList) => [...messageList, message]);
        scrollToBottom();
      } else {
        incrementCounter(channel_id);
        console.log(notificationList);
      }
    };

    socket.on("message", (data));
    socket.on("chat_users_changed", (channel_id) => {
      axios.get("https://fiscord.uw.r.appspot.com/chat/" + channel_id).then((res) => {
      setUsersInvolved(res.data.users_involved);
      console.log(res.data);
    });
  });
    socket.on("other-user-typing", (username, channel_id)=>{
      if(chatid === channel_id)
      {
        console.log("someone's typing");
      setTyper(username);
    }

    });
    socket.on("other-user-stopped-typing", (username, channel_id)=>{
      if(chatid === channel_id)
      {
        setTyper();
      }
      
    })
    socket.on("new-message", ()=>{
      Notify();
    });
    return () => {
      socket.off("message", (data));
      socket.off("user_left_chat");
      socket.off("other-user-typing");
      socket.off("user-stopped-typing");
      socket.off("new-message");}
  }, [socket, chatid, notificationList]);

  useEffect(() => {
    axios.get("https://fiscord.uw.r.appspot.com/chat/" + chatid).then((res) => {
      console.log(res.data);
      setChatValues(res.data);
      setUsersInvolved(res.data.users_involved);
      setMessageList(res.data.messages);
      socket.emit("in-channel", chatid); // {something here to clear notifications for this chatid}
      removeNotification(chatid);
      setLoading(false);
      scrollToBottom();
    });
  }, [chatid]);

  const render = () => {
    if (isLoading)
      return <span className="loading loading-spinner loading-md"></span>;

    return (
      <>
        <div className="w-full h-full bg-grey overflow-x-hidden">
          <div className="flex flex-col h-full">
            <div className="w-full bg-base-300/60 flex items-center h-16 flex-none shadow-lg">
              <div className="mx-3 font-bold"> # {chatValues?.chat_name}</div>
            </div>
            <ToastContainer />
            <div className="flex h-full">
                <div id="chatboxmiddle" className="h-full ">
                  <div id="chatbox" className="overflow-y-scroll">
                    {messageList ? (
                      <RenderMessages messages={messageList} />
                    ) : (
                      <></>
                    )}
                     <div ref={messagesEndRef} />
                  </div>
                  <div id="textBox"
                    className="fixed bottom-0 h-20 grid items-center"
                  >
                    <form
                      className="flex flex-row gap-x-1 px-5"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        className="text-white break-after-auto grow rounded"
                        placeholder="Message"
                        value={textBox}
                        onChange={handleTextBoxChange}
                      />
                      <button className="btn btn-sm" onClick={handleSubmit}>
                        Send
                      </button>
                    </form>
                    <div className="absolute bottom-0 text-left text-sm ml-3">{typer ? <span className="text-white"> {typer} is typing...</span>: <></>}</div>
                  </div>
                </div>
                <div className="p-4 w-60 h-full bg-base-300/40 text-base-content self-end">
                  {usersInvolved?.map((chatuser,index) => (
                    <Fragment key={index}>
                      <OtherUserPopUp user={chatuser} />
                    </Fragment>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return render();
};

export default Chatbox;
