const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    chat_name: { type: String, required: false },
    users_involved: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", required: false }],
    chat_type:{type:String, required:true}
});

// Virtual for author's URL
ChatSchema.virtual("url").get(function () {
    return `/chat/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Chat", ChatSchema);