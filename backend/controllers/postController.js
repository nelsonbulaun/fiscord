const Post = require("../models/Post");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");

exports.message_list = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find()
      .sort({ date_messaged: -1 })
      .populate("user")
      .exec();
  
    res.render("post_list", 
    {
    title: "Post List",
    post_list: allPosts,
    user:req.user });
  });


exports.post_get = (req, res) => res.render("post-form");


exports.post_get = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
  .populate([
      {
          path: 'user',
          populate: [{ path: 'username' }]
      }])
      .exec();

  if (post === null) {
      // No results.
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
  }

  res.render("post-view", {
      title: "Post",
      post: post,
      user: res.locals.currentUser,
  });
});

// Handle Post create on POST.
exports.post_create_post = [
    // Validate and sanitize fields.
    body("messagetitle")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Message Title must be specified.")
      .isAlphanumeric()
      .withMessage("Message Title has non-alphanumeric characters."),
    body("postcontent")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Message Content must be specified."),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
        // Create post object with escaped and trimmed data
        const post = new Post({
            messagetitle: req.body.messagetitle,
            postcontent: req.body.postcontent,
            user: req.user,
            date_messaged: DateTime.now()
        });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("post-form", {
          title: "Create Post",
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
  
        // Save post.
        await post.save();
        res.redirect("/");
      }
    }),
  ];


exports.post_delete_post = asyncHandler(async (req, res, next) => {
    console.log(req.body.postid);
    await Post.findByIdAndRemove(req.body.postid);
    res.redirect("/");
    }); 