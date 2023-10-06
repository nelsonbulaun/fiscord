import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";

export const InviteUser = ({ server }) => {
  const [inviteCode, setInviteCode] = useState();
  const [isLoading, setLoading] = useState(false);

  if ((server.invite_code = undefined)) {
    const newInviteCode = uuidv4();
    useEffect(() => {
      axios({
        method: "POST",
        url: "https://fiscord.uw.r.appspot.com/server/invite/add",
        data: {
          serverid: server._id,
          invite_code: newInviteCode,
        },
        withCredentials: true,
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          alert("Invite Code Generated");
          setInviteCode(newInviteCode);
        }
      });
    }, [server._id]);
  }

  function handleNewCode(e) {
    setLoading(true);
    const newInviteCode = uuidv4();
    axios({
      method: "POST",
      url: "https://fiscord.uw.r.appspot.com/server/invite/add",
      data: {
        serverid: server._id,
        invite_code: newInviteCode,
      },
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log(inviteCode);
        setInviteCode(newInviteCode);
      }
    });
  }

  return (
    <div className="mx-full justify-center flex flex-col items-center">
      <div>
        <h3 className="font-bold text-lg">Invite Link!</h3>
        <div className="box">
          <a type="text" class="input input-bordered w-full max-w-xs">
            {inviteCode ? "https://nelsonbulaun.github.io/fiscord/invite/" + inviteCode : <></>}
          </a>
        </div>
        <form
          className="grid grid-cols-1 space-y-0.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <button className="px-6 pb-2 pt-2.5 w-fit place-self-center" onClick={handleNewCode}>
            Generate New Code
          </button>
        </form>
      </div>
    </div>
  );
};
