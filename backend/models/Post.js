const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  messagetitle: { type: String, required: true },
  postcontent: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_messaged: { type: Date }
});

// Virtual for author's URL
PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});


// Export model
module.exports = mongoose.model("Post", PostSchema);