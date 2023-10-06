import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export const Logout = () => {
  const { setAuth, user, setUser } = useAuth();
  const navigate = useNavigate();
  const previousUser = user;

  function handleLogOut() {
    Axios({
      method: "GET",
      url: "https://fiscord.uw.r.appspot.com/log-out",
    withcredentials: true}).then((res) => console.log(res));
    localStorage.removeItem("user");
    setAuth(false);
    setUser(null);
    socket.emit("logged-off", previousUser);
    navigate("/login");
  }
  return (
    <div>
      <h1 className="p-2"> Are you sure you want to Log Out?</h1>
      <button
        className="bg-grey-500 hover:bg-grey-700 text-white font-bold py-2 px-4 border border-grey-700 rounded"
        onClick={handleLogOut}
      >
        {" "}
        Log Out
      </button>
    </div>
  );
};
