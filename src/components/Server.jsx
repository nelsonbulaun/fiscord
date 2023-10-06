import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import UserTab from "./UserTab";
import { InviteUserModal } from "../modals/InviteUserModal";
import Modal from "../modals/Modal";
import CreateChannel from "../modals/CreateChatChannel";
import { useNotificationList } from "../context/NotificationListContext";
import { UserPopUp } from "./UserPopUp";
import { useAuth } from "../context/AuthContext";
import { LeaveServerModal } from "../modals/LeaveServerModal";
import { ChangeServerName } from "../modals/ChangeServerNameModal";
import { useServerList } from "../context/ServerListContext";
import { InviteUser } from "../modals/InviteUser";

export default function Server() {
  const [currentServer, setCurrentServer] = useState();
  const [chatList, setChatList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [inviteModalState, setInviteModalState] = useState(false);
  const [chatChannelModalState, setChatChannelModalState] = useState(false);
  const [leaveServerModalState, setLeaveServerModalState] = useState(false);
  const [serverNameModalState, setServerNameModalState] = useState(false);
  const { notificationList } = useNotificationList([]);
  const { user } = useAuth();
  const { serverid } = useParams();
  const { serverList } = useServerList();

  useEffect(() => {
    if (
      serverList != [] &&
      serverList?.find((server) => server._id === serverid)
    ) {
      const foundserver = serverList?.find((server) => server._id === serverid);
      setCurrentServer(serverList?.find((server) => server._id === serverid));
      if (foundserver && foundserver.chats[0]) {
        setChatList([...foundserver?.chats]);
      }
      setLoading(false);
    }
  }, [serverid, serverList]);

  function onClickOpen() {
    setInviteModalState(true);
    setChatChannelModalState(false);
    setLeaveServerModalState(false);
    setServerNameModalState(false);
  }

  function onClickOpenChannelModal() {
    setChatChannelModalState(true);
    setInviteModalState(false);
    setLeaveServerModalState(false);
    setServerNameModalState(false);
  }

  function onClickOpenLeaveServerModal() {
    setLeaveServerModalState(true);
    setChatChannelModalState(false);
    setInviteModalState(false);
    setServerNameModalState(false);
  }

  function onClickOpenServerNameModal() {
    setServerNameModalState(true);
    setLeaveServerModalState(false);
    setChatChannelModalState(false);
    setInviteModalState(false);
  }

  const render = () => {
    if (isLoading)
      return <span className="loading loading-spinner loading-md"></span>;

    return (
      <div className="w-full h-full flex flex-row">
        {/* top bar */}
        <div className="h-full w-full flex overflow-hidden bg-base-100/50 rounded-l-xl outline outline-white/10 outline-1">
          <div
            id="chatList"
            className="menu p-0 w-60 rounded-l-lg min-h-full bg-base-300/40 text-base-content"
          >
            {" "}
            <div className="grid">
              <details className="dropdown open">
                <summary className="btn w-full h-16 bg-base-300/40 rounded-tl-lg  p-0 rounded-none">
                  {currentServer.server_name}
                </summary>
                <ul className="menu shadow dropdown-content z-50 bg-base-300/40 w-full backdrop-blur-md">
                  <button
                    className="text-left my-2 px-2 font-semibold"
                    onClick={onClickOpen}
                  >
                    Invite Users
                  </button>
                  <Modal
                    onClose={() => {
                      setInviteModalState(false);
                    }}
                    show={inviteModalState}
                    title="Invite Modal"
                  >
                    <InviteUser server={currentServer} />
                  </Modal>
                  <button
                    className="text-left my-2 px-2 font-semibold"
                    onClick={onClickOpenServerNameModal}
                  >
                    Change Server Name
                  </button>
                  <Modal
                    onClose={() => {
                      setServerNameModalState(false);
                    }}
                    show={serverNameModalState}
                    title="server name change"
                  >
                    <ChangeServerName
                      server={currentServer}
                      userid={user._id}
                    />
                  </Modal>
                  <button
                    className="text-left my-2 px-2 font-semibold"
                    onClick={onClickOpenChannelModal}
                  >
                    Add a Channel
                  </button>
                  <Modal
                    onClose={() => {
                      setChatChannelModalState(false);
                    }}
                    show={chatChannelModalState}
                    title="Create Create Channel"
                  >
                    <CreateChannel
                      server={currentServer}
                      chatList={chatList}
                      setChatList={setChatList}
                    />
                  </Modal>
                  <button
                    className="text-left my-2 px-2 font-semibold"
                    onClick={onClickOpenLeaveServerModal}
                  >
                    Leave Server
                  </button>
                  <Modal
                    onClose={() => {
                      setLeaveServerModalState(false);
                    }}
                    show={leaveServerModalState}
                    title="Create Create Channel"
                  >
                    <LeaveServerModal
                      server={currentServer}
                      userid={user._id}
                    />
                  </Modal>
                </ul>
              </details>
            </div>
            {/* ChatList bar */}
            <div className="flex flex-col grow w-full">
              <div className="collapse w-full">
                <input type="checkbox" />
                <div className="collapse-title text-sm text-left font-medium">
                  Text Channels
                </div>
                <div className="collapse-content p-1">
                  {chatList?.map((chat, index) => (
                    <Fragment key={index}>
                      <Link to={"/fiscord/servers/" + serverid + "/" + chat._id}>
                        <a className="flex rounded-lg">
                          <div className="leading-normal w-full">
                            {chat.chat_name ? (
                              <div className="text-left mx-3">
                                {" "}
                                # {chat.chat_name}{" "}
                                {notificationList?.some(
                                  (e) => e.id === chat._id
                                ) ? (
                                  <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2 py-0.5 rounded-xl dark:bg-red-900 dark:text-red-300">
                                    {
                                      notificationList[
                                        notificationList.findIndex(
                                          (e) => e.id === chat._id
                                        )
                                      ]["counter"]
                                    }
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                            {/* <h5 className="mb-2 text-m font-bold text-white dark:text-white">
                              {chat.users_involved.map((user) => (
                                <div> {user.username}</div>
                              ))}
                            </h5> */}
                          </div>
                        </a>
                      </Link>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            {/* Current User Tab Bar */}
            <div className="w-full grid items-center h-16 self-end flex-none bg-base-300/40">
              {/* <UserTab /> */}
              <UserPopUp user={user} />
            </div>
          </div>
          <div id="serverchatboxoutlet">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };
  return render();
}
