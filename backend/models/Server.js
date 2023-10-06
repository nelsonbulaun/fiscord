const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ServerSchema = new Schema({
    server_name: { type: String, required: true },
    server_avatar:{ type: String, required: false},
    users_involved: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat", required: false }],
    roles: [{ type: Schema.Types.ObjectId, ref: "Role", required: false }],
    invite_code: [{ type: String, required: false}]
});

// Virtual for author's URL
ServerSchema.virtual("url").get(function () {
    return `/chat/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Server", ServerSchema);