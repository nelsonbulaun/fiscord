import OtherUserTabs from "./OtherUserTabs";

export function OtherUserPopUp(props) {
  const user = props.user;
  const date = new Date(props.user.date_created);
  const formattedDate = date.toLocaleString("en-us");
  return (
    <div className="w-full">
      <div
        id="dropdownattempt"
        className="dropdown dropdown-left place-self-start w-full"
      >
        <label tabIndex="0" className="place-self-start">
          <OtherUserTabs user={props.user} />
        </label>
        <div
          tabIndex="0"
          className="dropdown-content z-[1] w-64 p-2 shadow card rounded-m bg-base-200/60 backdrop-blur-md text-primary-content"
        >
          <div className="container">
            <div>
  
              <div>
                <div className="object-fit">
                  <OtherUserTabs user={props.user} />{" "}
                </div>
                <div>
                  <div className="divider mx-2 py-0 mt-1 mb-0.5" />
                  <div className="text-left text-xs pt-0">
                  <h5
                  id="userpopup"
                  className="font-semibold uppercase text-[10px]"
                >
                  Status :
                </h5>{" "}
                {user.custom_status}
                  </div>
                </div>

                <div className="text-left text-xs gap-y-1 pt-2">
                <h5
                id="userpopup"
                className="font-semibold uppercase text-[10px]"
              >
                About me:
              </h5>{" "}
                  <div>
                    {user.about_me}
                  </div>
                  
                  <div className="divider mx-2 py-0 mt-1 mb-0.5" />
                  <h5
                id="userpopup"
                className="font-semibold uppercase text-[10px]"
              >Fiscord member since: </h5>
                  <div className="text-left text-xs py-1">
                    {formattedDate}
                  </div>
                </div>
                <div />
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OtherUserPopUpCard(props) {
  const user = props.user;
  const date = new Date(props.user.date_created);
  const formattedDate = date.toLocaleString("en-us");
  return (
    <div
      tabindex="0"
      class="dropdown-content z-[1] w-64 p-2 shadow card rounded-m bg-base-200/60 backdrop-blur-md text-primary-content"
    >
      <div class="container">
        <div>
          <div>
            <div className="object-fit">
              <OtherUserTabs user={props.user} />{" "}
            </div>
            <div>
              <div class="divider mx-2 py-0 mt-1 mb-0.5" />
              <div className="text-left text-xs py-1">
                <h5
                  id="userpopup"
                  className="font-semibold uppercase text-[10px]"
                >
                  Status :
                </h5>{" "}
                {props.custom_status}
              </div>
            </div>

            <div className="text-left text-xs gap-y-1 pt-2">
              <h5
                id="userpopup"
                className="font-semibold uppercase text-[10px]"
              >
                About me:
              </h5>{" "}
              <div>
                {props.about_me}
              </div>
            <div class="divider mx-2 py-0 mt-1 mb-0.5" />
                  <h5
                id="userpopup"
                className="font-semibold uppercase text-[10px]"
              >Fiscord member since: </h5>
                  <div className="text-left text-xs py-1">
                    {formattedDate}
                  </div>
                
            </div>
            <div />
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
