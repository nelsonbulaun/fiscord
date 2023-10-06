// import { format } from "date-fns";

import { Fragment } from "react";

function Message(props) {
  const date = new Date(props.date);
  const formattedDate = date.toLocaleTimeString("en-us");

  return (
    <Fragment key={props.id}>
      <div className="hover:bg-base-300/50">
        {props.showName ? (
          <>
            {" "}
            <img
              className="mask mask-circle w-10 h-10 mx-2 mt-2 float-left self-center"
              src={props.image} width="10" height="10"
            />
            <div className="text-xs text-left pt-1 flex flex-row">
              <p className="text-xs text-left pt-1">{props.name} </p>
              <p class="text-white/60 text-left text-[9px] self-center pt-1.5 ml-2 max-w-12">
                {formattedDate}
              </p>
            </div>
            <p>{"\n"}</p>
            <div className="text-left">{props.body}</div>
          </>
        ) : (
          <div class="group flex flex-row overflow-x-hidden overflow-y-hidden">
            <div className="relative -mr-12 self-end text-white/60 text-left text-xxs hidden group-hover:block">
              {formattedDate}
            </div>
            <div className="ml-14 float-right text-left">{props.body}</div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

function RenderMessage(showName = true, name, body, id, image, date) {
  return (
    <Fragment key={id}>
    <Message
      showName={showName}
      name={name}
      body={body}
      id={id}
      image={image}
      date={date}
    />    </Fragment>
  );
}

export function RenderMessages(props) {
  const messages = props.messages;
  let lastSenderId = undefined;

  return props.messages.map((message) => {
    let showName = !lastSenderId || message.sent_by._id !== lastSenderId;
    lastSenderId = message.sent_by._id;
    let image = message.sent_by.image
      ? message.sent_by.image
      : "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_1280.png";

    return RenderMessage(
      showName,
      message.sent_by.username,
      message.message_content,
      message._id,
      image,
      message.date_messaged
    );
  });
}
