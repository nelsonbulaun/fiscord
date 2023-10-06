import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createPortal } from "react-dom";

export const InviteUserModal = ({ server, inviteModalState, onClickClose }) => {
  const [inviteCode, setInviteCode] = useState();
  const [isLoading, setLoading] = useState(false);

  if (!inviteModalState) return null;

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
        setLoading(false);
      }
    });
  }

  return createPortal(
    <>
      <div id="invite">
        {/* <div className="container flex object-center"> */}
        <div>
          <h3 className="font-bold text-lg">Invite Link!</h3>
          <form
            className="grid grid-cols-1 space-y-0.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="box">
              <a type="text" class="input input-bordered w-full max-w-xs">
                {inviteCode ? "localhost:5173/invite/" + inviteCode : <></>}
              </a>
            </div>
            <button
              className="px-6 pb-2 pt-2.5 outline-grey-900"
              onClick={handleNewCode}
            >
              Generate new Code
            </button>
          </form>
          <div>
            <form>
              {/* if there is a button in form, it will close the modal */}
              <button onClick={onClickClose} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("root")
  );
};

// get invite code from server, if it doesnt exist create one

// button on click, generates uuid, run axios to push it to server,
// new link appears in form,
{
  /* <form
className="grid grid-cols-1 space-y-0.5"
onSubmit={(e) => e.preventDefault()}
>


<div className="box">
  <a type="text" class="input input-bordered w-full max-w-xs">
    {inviteCode}
  </a>
</div>
<button
  className="px-6 pb-2 pt-2.5 outline-grey-900"
  onClick={handleSubmit}
>
  Generate new Code
</button>
</form> */
}
