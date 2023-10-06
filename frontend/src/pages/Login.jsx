import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import Axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../socket";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [errorUsername, setErrorUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [data, setData] = useState(null);
  const { user, setAuth, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function handleUsernameChange(e) {
    if (errorUsername){
      setErrorUsername(false);}
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    if (errorPassword){
      setErrorPassword(false);}
    setPassword(e.target.value);
  }

  function pathErrorHighlights(val) {
    switch (val) {
      case "Incorrect username":
        setErrorUsername(true);
        break;
      case "Incorrect password":
        setErrorPassword(true);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    Axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/login",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
    }).then((res) => {
      if (
        res.status === 200 &&
        res.data !== "Incorrect username" &&
        res.data !== "Incorrect password"
      ) {
        alert("Successfully Authenticated");
        setUser(res.data);
        setAuth(true);
        const user = res.data;
        socket.emit("logged-in", user);
        const servers = res.data.servers;
        console.log(res.data);
        navigate(from, { replace: true });
      }
      if (
        res.data === "Incorrect username" ||
        res.data === "Incorrect password"
      ) {
        alert(res.data);
        pathErrorHighlights(res.data);
        setUsername("");
        setPassword("");
      }
    });
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex items-center justify-center">
        <div className="backdrop-blur-xs w-1/3 box bg-base-100/30 rounded-lg outline outline-white/10 outline-[1.5px] shadow-md">
          <div
            id="register"
            className="container rounded-lg shadow-sm backdrop-blur flex flex-col justify-center sm:py-12 items-center"
          >
            <Link to="/fiscord/"> <div className="text-2xl font-bold pb-10">
              fiscord
            </div></Link>
            <h1 className="pb-5">Please login to your account</h1>
            <form
              className="grid grid-cols-1 space-y-0.5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className={errorUsername === true ? "input-sm break-after-auto rounded input  input-bordered outline outline-red-800/80 outline-2":" input-sm break-after-auto rounded input input-bordered input-base-200"}
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              <input
                className={errorPassword === true ? "input-sm break-after-auto rounded input  input-bordered outline outline-red-800/80 outline-2":" input-sm break-after-auto rounded input input-bordered input-base-200"}
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                className="px-6 pb-2 pt-2.5 outline-grey-900"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
            <p className="p-2">Don't have an account?</p>
            <Link to="../register">
              <button className="px-6 pb-2 pt-2.5">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
