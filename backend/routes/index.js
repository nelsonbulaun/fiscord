var express = require('express');
var router = express.Router();
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const message_controller = require("../controllers/messageController");
const chat_controller = require("../controllers/chatController");
const server_controller = require("../controllers/serverController");

// User Routes
router.post("/register", user_controller.user_register);
router.post("/login", user_controller.user_login);
router.get("/user", user_controller.user_get);
router.get("/log-out", user_controller.user_logout);
router.post("/user/password/change", user_controller.user_change_password);
router.post("/user/server/add", user_controller.user_add_server);
router.get("/user/search/:title", user_controller.user_search);
router.post("/user/request/send",user_controller.user_send_request);
router.post("/user/request/cancel", user_controller.user_cancel_request);
router.post("/user/request/accept",user_controller.user_accept_request);
router.post("/user/request/decline",user_controller.user_decline_request);
router.post("/user/friends", user_controller.user_friends_list);
router.post("/user/friend/remove", user_controller.user_remove_friend);
router.post("/user/status/change", user_controller.user_custom_status);
router.post("/user/aboutme/change", user_controller.user_change_about_me);
router.post("/user/image/change", user_controller.user_change_image);

// Post Routes
router.get("/post/create", post_controller.post_get);
router.post("/post/create", post_controller.post_create_post);
router.post("/post/:id/delete", post_controller.post_delete_post);

//Server Routes
router.post("/servers",server_controller.server_list);
router.post("/server/get", server_controller.server_get);
router.post("/server/create", server_controller.server_create);
router.post("/server/chat/create",server_controller.server_chat_create);
router.post("/server/user/add",server_controller.server_add_user);
router.post("/server/user/remove",server_controller.server_remove_user);
router.post("/server/role/add",server_controller.server_add_user);
router.post("/server/role/remove",server_controller.server_remove_user);
router.post("/server/invite/add", server_controller.server_add_invite_code);
router.post("/server/invite/remove", server_controller.server_remove_invite_code);
router.get("/server/:inviteCode", server_controller.server_confirm_invite_code);
router.post("/server/avatar/change", server_controller.server_avatar_change);
router.post("/server/name/change",server_controller.server_name_change);

// Chat Routes
router.post("/chats", chat_controller.chat_list);
router.post("/chats/chat-messages", chat_controller.chat_list_non_server);
router.post("/chats/direct-messages", chat_controller.chat_list_direct_message);
router.post("/chat/create", chat_controller.chat_create);
router.get("/chat/:id", chat_controller.chat_get);

// Message Routes
router.post("/send-message", chat_controller.message_send);

module.exports = router;
