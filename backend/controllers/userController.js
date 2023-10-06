const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Server = require("../models/Server");
const { DateTime } = require("luxon");
var ObjectId = require("mongodb").ObjectId;
require("../passportConfig")(passport);

exports.user_login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send(info.message);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(user);
        console.log(req.user);
      });
    }
  })(req, res, next);
};

exports.user_get = (req, res) => {
  // populate('friends', '-_password -_email')
  res.send(req.user);
  console.log("succesfully gotten"); // The req.user stores the entire user that has been authenticated inside of it.
};

exports.user_register = [
  body("email")
    .isEmail()
    .notEmpty()
    .custom((value) => {
      return User.find({ email: value }).then((user) => {
        if (user.length !== 0) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("username")
    .notEmpty()
    .custom((value) => {
      return User.find({ username: value }).then((user) => {
        if (user.length !== 0) {
          return Promise.reject("Username is already in use");
        }
      });
    }),
  body("password").notEmpty().withMessage('Password is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      console.log(errors);
      res.send(errors);
    } else {
      try {
        bcrypt.hash(
          await req.body.password,
          10,
          async (err, hashedPassword) => {
            if (err) {
              console.log(err);
            } else {
              const user = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                address: req.body.address,
                date_created: DateTime.now(),
              });
              const result = await user.save();
              res.send(user);
            }
          }
        );
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Successfully logged out");
  });
};

exports.user_change_password = async (req, res) => {
  //Check passwords match
  if (req.body.newPassword != req.body.confirmNewPassword) {
    res.send({ msg: "New passwords do not match." });
  } else {
    //VALIDATION PASSED
    //Ensure current password submitted matches
    User.findOne({ username: req.body.username }).then((user) => {
      //encrypt newly submitted password
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          //Update password for user with new password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save();
            })
          );
          res.send("Password successfully updated!");
        } else {
          //Password does not match
          res.send("Password is Incorrect");
        }
      });
    });
  }
};

exports.user_add_server = asyncHandler(async (req, res, next) => {
  const target_server = await Server.findById({
    _id: req.body.serverid,
  }).exec();
  const updated_user = await User.findOneAndUpdate(
    { _id: req.body.userid },
    {
      $push: {
        servers: { server: target_server, date_joined: DateTime.now() },
      },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  ).populate("servers");
  res.json(updated_user);
  console.log(updated_user);
});

exports.user_search = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({
    username: new RegExp(req.params.title, "i"),
  }).exec();
  res.json(allUsers);
});

exports.user_send_request = asyncHandler(async (req, res, next) => {
  const user_request_reciever = await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $addToSet: {
        "pending_requests.incoming": req.body.currentUserId,
      },
    },
    { upsert: true }
  );
  const user_request_sender = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    {
      $addToSet: {
        "pending_requests.outgoing": req.body.userId,
      },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  )
    .populate(
      "friends",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .populate(
      "pending_requests.incoming",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .populate(
      "pending_requests.outgoing",
      "-password -last_name -first_name -address -pending_requests -__v"
    );
  console.log(user_request_sender);
  res.send(user_request_sender);
});

exports.user_cancel_request = asyncHandler(async (req, res, next) => {
  const user_request_sender = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    {
      $pull: { "pending_requests.outgoing": req.body.userId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  )
    .populate(
      "pending_requests.incoming",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .populate(
      "pending_requests.outgoing",
      "-password -last_name -first_name -address -pending_requests -__v"
    );
  const user_request_reciever = await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $pull: { "pending_requests.incoming": req.body.currentUserId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  );
  console.log(user_request_sender);
  res.send(user_request_sender);
});

exports.user_accept_request = asyncHandler(async (req, res, next) => {
  const user_request_reciever = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    {
      $pull: { "pending_requests.incoming": req.body.userId },
      $addToSet: { friends: req.body.userId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  )
    .populate(
      "friends",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .populate(
      "pending_requests",
      "-password -last_name -first_name -address -pending_requests -__v"
    );
  const user_request_sender = await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $pull: { "pending_requests.outgoing": req.body.currentUserId },
      $addToSet: { friends: req.body.currentUserId },
    },
    { upsert: true }
  ).exec();
  res.send(user_request_reciever);
});

exports.user_decline_request = asyncHandler(async (req, res, next) => {
  const user_request_reciever = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    {
      $pull: { "pending_requests.incoming": req.body.userId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  )
    .populate(
      "friends",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .populate(
      "pending_requests",
      "-password -last_name -first_name -address -pending_requests -__v"
    );
  const user_request_sender = await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $pull: { "pending_requests.outgoing": req.body.currentUserId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  ).exec();
  res.send(user_request_reciever);
});

exports.user_remove_friend = asyncHandler(async (req, res, next) => {
  const removing_user = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    {
      $pull: { friends: req.body.userId },
    },
    { upsert: true, returnOriginal: false, returnDocument: "after" }
  )
    .populate(
      "friends",
      "-password -last_name -first_name -address -pending_requests -__v"
    )
    .exec();
  const removed_user = await User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $pull: { friends: req.body.currentUserId },
    }
  );
  console.log(req.body.userId);
  res.send(removing_user);
});

exports.user_friends_list = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.body.currentUserId });
  await user.populate(
    "friends",
    "-password -last_name -first_name -address -pending_requests -__v"
  );
  await user.populate([
    {
      path: "pending_requests",
      populate: [{ path: "incoming" }],
    },
  ]);
  await user.populate([
    {
      path: "pending_requests",
      populate: [{ path: "outgoing" }],
    },
  ]);
  console.log(user);
  res.send(user);
});

exports.user_custom_status = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    { $set: { custom_status: req.body.custom_status } },
    { upsert: true }
  );
  user.save();
  res.send(user);
});

exports.user_change_about_me = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    { $set: { about_me: req.body.about_me } },
    { upsert: true }
  );
  user.save();
  res.send(user);
});

exports.user_change_image = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.body.currentUserId },
    { $set: { image: req.body.image } },
    { upsert: true }
  );
  user.save();
  res.send(user);
});
