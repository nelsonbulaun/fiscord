const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    role_name: { type: String, required: true },
    users_involved: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    permissions: [{ type: Schema.Types.ObjectId, ref: "Message", required: false }],
});

// Virtual for author's URL
ChatSchema.virtual("url").get(function () {
    return `/role/${this._id}`;
  });

// Export model
module.exports = mongoose.model("Role", RoleSchema);