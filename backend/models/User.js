const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  image: { type: String, required: false },
  date_created: { type: Date },
  about_me: { type: String, required: false },
  online_status: { type: Boolean },
  custom_status: { type: String, required: false },
  servers: [
    {
      server: { type: Schema.Types.ObjectId, ref: "Server", required: false },
      date_joined: { type: Date },
    },
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pending_requests: {
    outgoing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    incoming: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }
      
    });

// Virtual for author's URL
UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
