const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

exports.chat_list = async (req, res, next) => {
  const allChats = await Chat.find({
    users_involved: { $in: req.body.currentUserId },
  })
    .populate([
      {
        path: "users_involved",
        populate: { path: "username", select:"-password" },
      },
    ])
    .populate("messages")
    .exec();
  res.json(allChats);
  console.log(allChats);
};

exports.chat_list_non_server = async (req, res, next) => {
  const allChats = await Chat.find({
    $and: [
      { users_involved: { $in: req.body.currentUserId } },
      {
        $or: [
          { chat_type: { $eq: "group_chat" } },
          { chat_type: { $eq: "direct_message" } },
        ],
      },
    ],
  })
    .populate([
      {
        path: "users_involved",
        populate: { path: "username", select: "-password" },
      },
    ])
    .populate("messages")
    .exec();
  res.json(allChats);
  console.log(allChats);
};

exports.chat_list_direct_message = async (req, res, next) => {
  const allChats = await Chat.findOne({$and: [
    {users_involved: { $all: [req.body.currentUserId, req.body.userId] }},
    {chat_type:{$eq:"direct_message"}}

  ]})
    .populate([
      {
        path: "users_involved",
        populate: { path: "username", select:"-password" },
      },
    ])
    .populate("messages")
    .exec();
  res.send(allChats);
  console.log(allChats);
};

exports.chat_create = [
  // Process request after validation and sanitization.
  asyncHandler(async (req, res) => {
    // Create post object with escaped and trimmed data
    const chat = await new Chat({
      users_involved: [req.body.currentUserId, req.body.userid],
      chat_type: req.body.chat_type,
    });
    await chat.save();
    await chat.populate("users_involved", "-password");

    res.send(chat);
  }),
];

// Handle Post create on POST.
exports.message_send = [
  // Validate and sanitize fields.
  body("message_content")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Message must be specified."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create post object with escaped and trimmed data
    const message = new Message({
      sent_by: req.body.currentUser,
      message_content: req.body.message_content,
      date_messaged: DateTime.now(),
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      const original_chat = await Chat.findById({ _id: req.body.chatid }).exec;
      if (original_chat.messages != null) {
        res.status(400).json(original_chat, errors);
      } else {
        res.status(400).json(errors);
      }
    } else {
      // Data from form is valid.
      await message.populate(
        [
          {
            path: "sent_by", select: "-password"
          },
        ],
        
      );
      await message.save();
      // await message.populate("sent_by");
      const updated_chat = await Chat.findOneAndUpdate(
        { _id: req.body.chatid },
        { $push: { messages: message } },
        { returnOriginal: false, returnDocument: "after" }
      )
        .populate("users_involved", "-password")
        .populate("messages")
        .populate([
          {
            path: "messages",
            populate: [{ path: "sent_by", select:"-password" }],
          },
        ])
        .exec();
      await res.json(message);
      // await res.json(updated_chat);
    }
  }),
];

exports.chat_get = asyncHandler(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id)
    .populate("users_involved", "-password")
    .populate("messages")
    .populate([
      {
        path: "messages",
        populate: [{ path: "sent_by", select:"-password" }],
      },
    ])
    .exec();

  if (chat === null) {
    // No results.
    const err = new Error("Chat not found");
    err.status = 404;
    return next(err);
  }

  res.json(chat);
});
