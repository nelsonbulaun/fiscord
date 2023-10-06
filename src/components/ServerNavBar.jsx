import "../index.css";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import ChatList from "./DirectMessages";
import { ReactComponent as Settingsicon } from "../assets/settings.svg";
import { ReactComponent as DiscordIcon } from "../assets/discord.svg";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";
import UserTab from "./UserTab";
import Modal from "../modals/Modal";
import CreateServer from "../modals/CreateServer";
import logo from "../assets/logo.jpeg";
import { useAuth } from "../context/AuthContext";
import { useServerList } from "../context/ServerListContext";
import { useNotificationList } from "../context/NotificationListContext";
import { useDirectMessageList } from "../context/DirectMessageListContext";

export const Layout = () => {
  const [isLoading, setLoading] = useState(true);
  const { serverList, setServerList } = useServerList();
  const [createServerModalState, setCreateServerModalState] = useState(false);
  const { notificationList } = useNotificationList();
  const { directMessageList} = useDirectMessageList();
  
  const [sum, setSum] = useState(0); // State to hold the sum of counters
  function onClickOpen() {
    setCreateServerModalState(true);
  }
  

  // Function to calculate the sum
  function calculateSum(val) {
    const filteredObjects = notificationList?.filter((obj) =>
      val?.map((value) => value._id).includes(obj.id)
    );

    const sumOfCounters = filteredObjects.reduce(
      (acc, obj) => acc + obj.counter,
      0
    );
    return sumOfCounters;
  }

  return (
    <div className="h-screen w-screen">
      <div className="z-50 fixed top-0 left-0 h-screen min-h-full w-16 m-0 flex flex-col overflow-visible flex-none ">
        <div className="pt-5">
          <NavLink
            className={({ isActive }) =>
              isActive ? "active-class" : "non-active-class"
            }
            to="/fiscord/"
          >
            {/* className="p-2 pt-2"> */}
            <button className="rounded-3xl hover:rounded-xl">
              <img
                className="w-10 h-10 rounded-3xl hover:rounded-xl"
                src={logo}
              />
              {/* <DiscordIcon /> */}
            </button>
          </NavLink>
        </div>
        {/* <div className="divider my-0 py-0 mx-2" />
        <NavLink
          className={({ isActive }) =>
            isActive ? "active-class" : "non-active-class"
          }
          to="/chats/friends"
        >
          <div
            className="tooltip tooltip-right overflow-visible"
            data-tip="Direct Messages"
          ><MailIcon />
            {((notificationList && directMessageList != []) && calculateSum(directMessageList) != 0) ? (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                        {calculateSum(directMessageList)}{" "}
                      </div>
                    ) : <></>}
            
          </div>
        </NavLink> */}
        <div className="divider my-0 mx-2 py-0" />
        {serverList != [] ? serverList?.map((listedServer,index) => (
          <Fragment key={index}>
            <NavLink
              className={({ isActive }) =>
                isActive ? "active-class" : "non-active-class"
              }
              to={
                listedServer?.chats[0]._id
                  ? "/fiscord/servers/" + listedServer._id + "/" + listedServer.chats[0]._id
                  : "/fiscord/servers/" + listedServer._id
              } 
            >
              <button className="p-1 w-full ">
                <div
                  className="tooltip tooltip-right overflow-visible"
                  data-tip={listedServer.server_name}
                >
                  <div className="rounded-3xl hover:rounded-xl">
                    {listedServer.server_avatar ? (
                      <img className="w-10 h-10 rounded-3xl hover:rounded-xl" src={listedServer.server_avatar} />
                    ) : (
                      <div className="avatar placeholder items-center">
                        <div className="bg-base-200/40 text-neutral-content rounded-full w-12 hover:rounded-xl">
                          <span className="text-2xl text-center uppercase">
                            {listedServer.server_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    {listedServer.chats != [] && notificationList && calculateSum(listedServer?.chats) != 0 ? (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                        {calculateSum(listedServer?.chats)}{" "}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>{" "}
              </button>
            </NavLink>
          </Fragment>))  : <></>}
        
        
        <button className="text-left place-self-center" onClick={onClickOpen}>
          <PlusIcon />
        </button>
        <Modal
          onClose={() => {
            setCreateServerModalState(false);
          }}
          show={createServerModalState}
          title="Create Server"
        >
          <CreateServer setCreateServerModalState={setCreateServerModalState}/>
        </Modal>
      </div>
      <div id="servernavbaroutlet" className="ml-16 flex h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
