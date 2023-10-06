import { ReactComponent as Settingsicon } from "../assets/settings.svg";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserTab() {
  const { user } = useAuth();

  return (
    <div>
      {!user ? (
        <></>
      ) : (
        <div className="flex h-full items-center">
          <div className="h-full flex basis-3/4 items-center ml-3">
            {/* <div
              class={user.online_status ? "avatar online" : "avatar offline"}
            >
              <div class="w-9 rounded-full">
                <img
                  src={
                    user.image
                      ? user.image
                      : "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_1280.png"
                  }
                />
              </div>
            </div> */}
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full"
                src={
                  user.image
                    ? user.image
                    : "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_1280.png"
                }
                alt="profile image"
              />
              <span
                className= {
                  user.online_status=true ? "bottom-0 left-7 absolute  w-3.5 h-3.5 border-2 bg-green-500 border-white dark:border-gray-800 rounded-full" : 
                  "bottom-0 left-7 absolute  w-3.5 h-3.5 border-2 bg-grey-100 border-white dark:border-gray-800 rounded-full"
                }
              ></span>
            </div>
            <a className="mx-2">{user.username}</a>
          </div>
          <div className="h-full flex basis-1/4">
            <Link to="/fiscord/settings">
              <Settingsicon />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
