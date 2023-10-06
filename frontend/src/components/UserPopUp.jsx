import OtherUserTabs from "./OtherUserTabs";
import { useState } from "react";
import Modal from "../modals/Modal";
import UserTab from "./UserTab";
import ChangeCustomStatusModal from "../modals/ChangeStatusModal";

export function UserPopUp(props) {
  const [statusModalState, setStatusModalState] = useState(false);
  const user = props.user;
  const date = new Date(props.user.date_created);
  const formattedDate = date.toLocaleString("en-us");

  function onClickOpen() {
    setStatusModalState(true);
    console.log(statusModalState);
  }

  return (
    <div className="w-full">
      <div
        id="dropdownattempt"
        class="dropdown dropdown-top place-self-start w-full"
      >
        <label tabIndex="0" className="place-self-start">
          <UserTab />
        </label>
        <div
          tabIndex="0"
          className="dropdown-content z-[1] w-64 p-2 shadow card rounded-m bg-base-200/60 backdrop-blur-md text-primary-content"
        >
          <div>
            <div>
              <div className="object-fit py-0 gap-y-1">
                <OtherUserTabs user={props.user} />{" "}
              </div>
              <div className="divider mx-2 py-0 mt-1 mb-0.5" />
              <div className="w-full grid justify-items-start">
                {user.about_me != null ? (
                  <div className="text-left text-xs gap-y-1 pt-2">
                    <h5
                      id="userpopup"
                      className="font-semibold uppercase text-[10px]"
                    >
                      About me:
                    </h5>{" "}
                    <div>{user.about_me}</div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="text-left font-xs py-1">
                  <h5
                    id="userpopup"
                    className="font-semibold uppercase text-[10px]"
                  >
                    Status :
                  </h5>{" "}
                  {user.custom_status}
                </div>
                <button
                  className="text-[10px] self-start"
                  onClick={onClickOpen}
                >
                  Set Status
                </button>
                <Modal
                  onClose={() => {
                    setStatusModalState(false);
                  }}
                  show={statusModalState}
                  title="Status Modal"
                >
                  <ChangeCustomStatusModal />
                </Modal>
              </div>
              <div className="divider mx-2 py-0 mt-1 mb-0.5" />
              <div className="text-left text-xs gap-y-1">
                <div className="text-left text-xs py-1">
                  <h5
                    id="userpopup"
                    className="font-semibold uppercase text-[10px]"
                  >
                    Fiscord member since:{" "}
                  </h5>
                  <p> {formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
