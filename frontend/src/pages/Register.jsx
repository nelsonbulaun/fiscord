import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();

  function handleRegisterEmailChange(e) {
    if (errorEmail) {
      setErrorEmail(false);
    }
    setRegisterEmail(e.target.value);
  }

  function handleRegisterUsernameChange(e) {
    if (errorUsername) {
      setErrorUsername(false);
    }
    setRegisterUsername(e.target.value);
  }

  function handleRegisterPasswordChange(e) {
    if (errorPassword) {
      setErrorPassword(false);
    }
    setRegisterPassword(e.target.value);
  }

  function handleRegisterFirstNameChange(e) {
    setRegisterFirstName(e.target.value);
  }

  function handleRegisterLastNameChange(e) {
    setRegisterLastName(e.target.value);
  }

  function pathErrorHighlights(val) {
    switch (val) {
      case "email":
        setErrorEmail(true);
        console.log(errorEmail);
        break;
      case "username":
        setErrorUsername(true);
        break;
      case "password":
        setErrorPassword(true);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios({
      method: "POST",
      data: {
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
        first_name: registerFirstName,
        last_name: registerLastName,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/register",
    }).then((res) => {
      console.log(res);
      if (res.data.errors) {
        console.log(res.data.errors);
        for (let i = 0; i < res.data.errors.length; i++) {
          alert(res.data.errors[i].msg);
          pathErrorHighlights(res.data.errors[i].path);
        }
      }
      if (res.status === 200) {
        setAuth(true);
        setUser(res.data);
        console.log(res.data);
        navigate("/");
      }
    });
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full h-full flex items-center justify-center">
          <div className="backdrop-blur-xs w-1/3 box bg-base-100/30 rounded-lg outline outline-white/10 outline-[1.5px] shadow-md">
            <div
              id="login"
              className="container rounded-lg shadow-sm backdrop-blur flex flex-col justify-center sm:py-12 items-center"
            >
              <a href="/fiscord/" className="text-2xl font-bold pb-5">
                fiscord
              </a>
              <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5">
                  {" "}
                  Sign Up{" "}
                </h1>
                <form
                  className="grid grid-cols-1 space-y-0.5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className={
                      errorEmail === true
                        ? "input-sm break-after-auto rounded input  input-bordered outline outline-red-800/80 outline-2"
                        : " input-sm break-after-auto rounded input input-bordered input-base-200"
                    }
                    placeholder="Email"
                    value={registerEmail}
                    onChange={handleRegisterEmailChange}
                  />
                  <input
                    className={
                      errorUsername === true
                        ? "input-sm break-after-auto rounded input input-bordered outline outline-red-800/80 outline-2"
                        : "input-sm break-after-auto rounded input input-bordered input-base-200"
                    }
                    placeholder="Username"
                    value={registerUsername}
                    onChange={handleRegisterUsernameChange}
                  />
                  <input
                    className={
                      errorPassword === true
                        ? "input-sm break-after-auto rounded input input-bordered outline outline-red-800/80 outline-2"
                        : "input-sm break-after-auto rounded input input-bordered input-base-200"
                    }
                    placeholder="Password"
                    type="password"
                    value={registerPassword}
                    onChange={handleRegisterPasswordChange}
                  />

                  <input
                    className="input-sm break-after-auto rounded input input-bordered input-base-200"
                    placeholder="First Name"
                    value={registerFirstName}
                    onChange={handleRegisterFirstNameChange}
                  />
                  <input
                    className="input-sm break-after-auto rounded input input-bordered input-base-200"
                    placeholder="Last Name"
                    value={registerLastName}
                    onChange={handleRegisterLastNameChange}
                  />
                  <button
                    className="px-6 pb-2 pt-2.5 outline-grey-900"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </form>
                <p className="p-2">Already Have an Account?</p>
                <Link to="../login">
                  <button className="px-6 pb-2 pt-2.5">Login</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
