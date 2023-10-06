const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const Server = require("../models/Server");
const { json } = require("body-parser");
const mongoose = require("mongoose");


exports.server_list = async (req, res, next) => {
  const allServers = await Server.find({
    users_involved: { $in: req.body.currentUserId },
  }).populate("chats")
    .populate([
      {
        path: "users_involved", select: "-password -last_name -first_name -address -pending_requests -__v"
      },
    ])
    .exec();
  res.json(allServers);
  console.log(allServers);
};

exports.server_create = [
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    const newChat = new Chat({
      chat_name: "General",
      users_involved: [req.body.currentUserId],
      chat_type: "server_chat"
    })
    await newChat.populate("users_involved", "-password -last_name -first_name -address -pending_requests -__v");
    await newChat.save();

    const server = await new Server({
      server_name: req.body.server_name,
      users_involved: [req.body.currentUserId],
      chats: []
    }).save();

    const updated_server = await Server.findOneAndUpdate(
      { _id: server._id },
      { $push: { chats: newChat } },
      { returnOriginal: false, returnDocument: "after" }
    ).populate("chats");

    res.send(updated_server);
    })

];

exports.server_chat_create = [
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Create post object with escaped and trimmed data
    const chat = await new Chat({
      chat_name: req.body.chat_name,
      users_involved: req.body.serverUsers,
      "chat_type":"server_chat",
    });
    await chat.populate("users_involved", "-password -last_name -first_name -address -pending_requests -__v");
    await chat.save();


    const updated_server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $push: { chats: chat } },
      { returnOriginal: false, returnDocument: "after" }
    );
    
    res.send(chat);
  }),
];


exports.server_get = [
    asyncHandler(async (req, res, next) => {
    const server = await Server.findById(req.body.serverid)
    .populate("chats")
    .populate([
        {
          path: "users_involved", select:"-password -last_name -first_name -address -pending_requests -__v"
        },
      ])
      .populate("chats")
      .populate([
        {
          path: "chats",
          populate: [{ path: "chat_name" }],
        },
      ]).populate([
        {
          path: "chats",
          populate: [{ path: "messages" }],
        },
      ])
      .exec();
  
    if (server === null) {
      // No results.
      const err = new Error("Chat not found");
      err.status = 404;
      return next(err);
    }
  
    res.json(server);
  })
]
  
exports.server_add_user = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $push: { users_involved: req.body.userid }},
      { returnOriginal: false, returnDocument: "after" }
    ).populate("chats");

    const idList = server.chats.map(chat => chat._id);
    const result = await Chat.updateMany( { _id: { $in: idList } }, 
      {$push: {
        users_involved: req.body.userid // The value you want to push into the array
      }});

    console.log(result);
    res.send(server);
  })
];

exports.server_remove_user = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $pull: { users_involved: req.body.userid } },
      { returnOriginal: false, returnDocument: "after" }
    );
    const idList = server.chats.map(chat => chat._id);
    const result = await Chat.updateMany( { _id: { $in: idList } }, 
      {$pull: {
        users_involved: req.body.userid // The value you want to push into the array
      }});
    res.send("user removed");
  }),
];

exports.server_add_role = [
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    const role = await new Chat({
      role_name: req.body.role_name,
    });
    await role.save();

    const updated_server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $push: { roles: role } },
      { returnOriginal: false, returnDocument: "after" }
    );
    res.send("role created");
  }),
];

exports.server_remove_role = [
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    const updated_server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $pull: { roles: req.body.role_name } },
      { returnOriginal: false, returnDocument: "after" }
    );
    res.send("role removed");
  }),
];

exports.server_add_invite_code = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $push: { invite_code: req.body.invite_code } },
      { returnOriginal: false, returnDocument: "after" }
    );
    res.send("invite code added");
  }),
];

exports.server_remove_invite_code = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $pull: { invite_code: req.body.invite_code }  },
      { returnOriginal: false, returnDocument: "after" }
    );
    res.send("invite code removed");
  }),
];

exports.server_confirm_invite_code = async (req, res, next) => {
  const server = await Server.findOne({
    invite_code: { $in: req.params.inviteCode},
  }).populate("chats");
  
  res.send(server);
};

exports.server_avatar_change = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $set: { server_avatar: req.body.serveravatar } },
      { returnOriginal: false, returnDocument: "after" }
    );
    res.send("Server avatar changed!");
  }),
];

exports.server_name_change = [
  asyncHandler(async (req, res) => {
    const server = await Server.findOneAndUpdate(
      { _id: req.body.serverid },
      { $set: { server_name: req.body.server_name } },
      { returnOriginal: false, returnDocument: "after" }
    ).populate("chats")
    .populate([
        {
          path: "users_involved",
          populate: [{ path: "username" }],
        },
      ])
      .populate("chats")
      .populate([
        {
          path: "chats",
          populate: [{ path: "chat_name" }],
        },
      ]).populate([
        {
          path: "chats",
          populate: [{ path: "messages" }],
        },
      ])
    res.send(server);
  }),
];
