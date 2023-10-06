export default function OtherUserTabs(props){
    return(
        <div className="flex flex-row place-items-center p-1">

<div className="relative">
              <img
                className="w-10 h-10 rounded-full"
                src={
                  props.user.image
                    ? props.user.image
                    : "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_1280.png"
                }
                alt="profile image"
              />
              <span
                className= {
                  (props.user.online_status===true) ? "bottom-0 left-7 absolute  w-3.5 h-3.5 border-2 bg-green-500 border-white dark:border-gray-800 rounded-full" : 
                  "bottom-0 left-7 absolute  w-3.5 h-3.5 border-2 bg-grey-100 border-white dark:border-gray-800 rounded-full"
                }
              ></span>
            </div>
        
        <div className="mx-2">{props.user.username}</div>
        </div>
    )
}