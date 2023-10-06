const User = require("../models/User");
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

exports.message_get = asyncHandler(async (req, res, next) => {
  const allMessages = await message.find({}, "title author")
    .sort({ title: 1 })
    .populate("sent_by.username")
    .exec();

  res.render("message_list", { title: "Book List", message_list: allMessages });
});

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
            // users_involved: req.body.users_involved,
            sent_by: req.locals.currentUser,
            message_content: req.body.messagecontent,
            date_messaged: DateTime.now()
        });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.send(errors)
        }
       else {
        // Data from form is valid.
  
        // Save post.
        await message.save();
        res.send("/");
      }
    }),
  ];
