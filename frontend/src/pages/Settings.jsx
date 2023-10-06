import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../modals/Modal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { Logout } from "../modals/Logout";
import { useAuth } from "../context/AuthContext";
import OtherUserTabs from "../components/OtherUserTabs";
import axios from "axios";
import {
  OtherUserPopUp,
  OtherUserPopUpCard,
} from "../components/OtherUserPopUp";

export default function Settings() {
  const [changePasswordModalState, setChangePasswordModalState] =
    useState(false);
  const [logOutModalState, setLogOutModalState] = useState(false);
  const [aboutMe, setAboutMe] = useState("");
  const [userImage, setUserImage] = useState("");
  const { user, setUser } = useAuth();
  const [customStatus, setCustomStatus] = useState("");

  function onClickOpen() {
    setChangePasswordModalState(true);
  }

  function onClickLogOutModal() {
    setLogOutModalState(true);
  }

  function handleCustomStatusChange(e) {
    setCustomStatus(e.target.value);
  }

  function handleAboutMeChange(e) {
    setAboutMe(e.target.value);
  }

  function handleUserImageChange(e) {
    setUserImage(e.target.value);
  }

  function handleSubmitAboutMe(e) {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        currentUserId: user._id,
        about_me: aboutMe,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/user/aboutme/change",
    }).then((res) => {
      console.log(res);
      setCustomStatus("");
      setUser(res.data);
    });
  }

  function handleSubmitUserImage(e) {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        currentUserId: user._id,
        image: userImage,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/user/image/change",
    }).then((res) => {
      console.log(res);
      setCustomStatus("");
      setUser(res.data);
    });
  }

  function handleSubmitCustomStatus(e) {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        currentUserId: user._id,
        custom_status: customStatus,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/user/status/change",
    }).then((res) => {
      console.log(res);
      setCustomStatus("");
      setUser(res.data);
    });
  }

  return (
    <>
      <div className="drawer drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle top-0 left-25 relative"
        />

        <div className="drawer-content">
          <h5 className="font-semibold text-left m-8">My Account</h5>
          <div className="grid grid-cols-2">
            <div className="m-2 w-5/6 flex flex-col justify-self-end">
              <form
                className="flex flex-col w-3/4 space-y-0.5 mx-2 mt-10"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="text-left">Change User Image</label>
                <input
                  className="text-black break-after-auto rounded outline-grey-900"
                  placeholder="Place the image url here"
                  value={userImage}
                  onChange={handleUserImageChange}
                />

                <button
                  className="px-6 pb-2 pt-2.5 outline-grey-900"
                  onClick={handleSubmitUserImage}
                >
                  Submit
                </button>
              </form>
              <form
                className="flex flex-col w-3/4 space-y-0.5 mx-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="text-left">Status</label>
                <input
                  className="text-black break-after-auto rounded outline-grey-900"
                  placeholder="Status"
                  value={customStatus}
                  onChange={handleCustomStatusChange}
                />
                <button
                  className="px-6 pb-2 pt-2.5 outline-grey-900"
                  onClick={handleSubmitCustomStatus}
                >
                  Submit
                </button>
              </form>
              <form
                className="flex flex-col w-3/4 space-y-0.5 mx-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="text-left">About Me</label>
                <input
                  className="text-black break-after-auto rounded outline-grey-900"
                  placeholder="About me"
                  value={aboutMe}
                  onChange={handleAboutMeChange}
                />

                <button
                  className="px-6 pb-2 pt-2.5 outline-grey-900"
                  onClick={handleSubmitAboutMe}
                >
                  Submit
                </button>
              </form>
            </div>
            <div>
              <OtherUserPopUpCard
                user={user}
                custom_status={customStatus}
                about_me={aboutMe}
              />
            </div>
          </div>
        </div>

        <div className="drawer-side rounded-l-xl">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-60 min-h-full bg-base-200/50 text-base-content">
            {/* Sidebar content here */}
            <div className="text-left font-semibold pt-4"> User Settings</div>
            <div className="p-2">
              <li>
                <button onClick={onClickOpen}>Change Password</button>
                <Modal
                  onClose={() => {
                    setChangePasswordModalState(false);
                  }}
                  show={changePasswordModalState}
                  title="Change Password"
                >
                  <ChangePasswordModal />
                </Modal>
              </li>
              <li>
                <button onClick={onClickLogOutModal}>Log Out</button>
                <Modal
                  onClose={() => {
                    setLogOutModalState(false);
                  }}
                  show={logOutModalState}
                  title="Log Out"
                >
                  <Logout />
                </Modal>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
