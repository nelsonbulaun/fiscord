import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../index.css";

export const ChangePasswordModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleNewPasswordChange(e) {
    setNewPassword(e.target.value);
  }

  function handleConfirmNewPasswordChange(e) {
    setConfirmNewPassword(e.target.value);
  }


  function handleSubmit(e) {
    e.preventDefault();

    axios({
      method: "POST",
      data: { //fix new fields
        // email: registerEmail,
        username: username,
        password: password,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/user/password/change",
    }).then((res) => console.log(res));
  }

  return (
    <>
      <div className="mx-full justify-center flex flex-col items-center">
        <div id="login" className="container rounded-lg shadow-sm flex flex-col justify-center sm:py-12 items-center">

          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5"> Change Password </h1>
            <form
              className="grid grid-cols-1 space-y-0.5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="text-black break-after-auto rounded outline-grey-900"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              <input
                className="text-black break-after-auto rounded outline-grey-900"
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <input
                className="text-black break-after-auto rounded outline-grey-900"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />

              <input
                className="text-black break-after-auto rounded outline-grey-900"
                placeholder="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
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
      </div>
    </>
  );
};

export default ChangePasswordModal;