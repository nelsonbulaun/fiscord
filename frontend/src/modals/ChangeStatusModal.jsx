import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export const ChangeCustomStatusModal = () => {
  const [customStatus, setCustomStatus] = useState("");
  const {user, setUser} = useAuth();
  

  function handleCustomStatusChange(e) {
    setCustomStatus(e.target.value);
  }


  function handleSubmit(e) {
    e.preventDefault();
    axios({
      method: "POST",
      data: {
        currentUserId: user._id,
        custom_status: customStatus,
      },
      withCredentials: true,
      url: "https://fiscord.uw.r.appspot.com/user/status/change",
    }).then((res) => {console.log(res)
    setCustomStatus("");
    setUser(res.data);
  });
  }

  return (
    <>
      <div className="mx-full justify-center flex flex-col items-center">
        <div id="Change Status" className="container rounded-lg shadow-sm flex flex-col justify-center sm:py-12 items-center">

          <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
            <h1 className="font-bold text-center text-2xl mb-5"> Change Status </h1>
            <form
              className="grid grid-cols-1 space-y-0.5"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="text-black break-after-auto rounded outline-grey-900"
                placeholder="Status"
                value={customStatus}
                onChange={handleCustomStatusChange}
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

export default ChangeCustomStatusModal;