const User = require("../models/User");
const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server, {
    cors: {
      origin: ["https://nelsonbulaun.github.io"],
    },
  });
  io.listen(65080);


  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", function () {
      if (socket.userid != undefined) {
        UserSignedOff(socket.userid);
        socket.broadcast.emit("logged-off");
        console.log(socket.userid, "signed off");
      }
      console.log("user disconnected");
    });
    socket.on("logged-in", (user) => {
      socket.userid = user._id;
      socket.join(user._id);
      UserSignedOn(user._id);
      socket.broadcast.emit("logged-in");
    });
    socket.on("logged-off", (user) => {
      UserSignedOff(user._id);
      socket.broadcast.emit("logged-off");
    });
    socket.on("friendslist-changed", (userid, friendid) => {
      console.log("change occurred between", userid, friendid);
      socket
        .to(userid)
        .to(friendid)
        .emit("friendslist-changed-occurred", friendid);
    });

    socket.on("join_rooms", (channel_id) => {
      socket.join(channel_id);
      console.log(`${socket.userid} joined channel socket ${channel_id}`);
    });
    socket.on("leave_rooms", (channel_id) => {
      socket.leave(channel_id);
      console.log(`socket left channel ${channel_id}`);
    });
    socket.on("join_chat", (chatid) => {
      socket.to(chatid).emit("chat_users_changed", chatid);
      console.log(`${socket.userid} joined chat ${chatid}`);
    });
    socket.on("leave_chat", (channel_id) => {
      socket.to(channel_id).emit("chat_users_changed", channel_id);
      console.log(`user left channel ${channel_id}`);
    });
    // io.in(channel_id).emit("message", message);
    socket.on("send-message-channel", (message, channel_id) => {
      io.emit("message", message, channel_id);
      socket.to(channel_id).emit("new-message");
      console.log(
        "socket messaged",
        message.message_content,
        " in channel",
        channel_id
      );
    });
    socket.on("server-update", (serverid) => {
      console.log(serverid);
      socket.to(serverid).emit("server-must-update", serverid);
    });
    socket.on("user-typing", (user, channel_id) => {
      console.log(user, "is typing in", channel_id);
      socket.to(channel_id).emit("other-user-typing", user, channel_id);
    });
    socket.on("user-stopped-typing", (user, channel_id) => {
      console.log(user, "is no longer typing");
      socket.to(channel_id).emit("other-user-stopped-typing", user, channel_id);
    });
  });

  const UserSignedOn = async (userid) => {
    const user = await User.updateOne(
      { _id: userid },
      { $set: { online_status: 1 } }
    ).exec();
  };
  const UserSignedOff = async (userid) => {
    const user = await User.updateOne(
      { _id: userid },
      { $set: { online_status: false } }
    ).exec();
    console.log(user);
  };
  return io;
};
