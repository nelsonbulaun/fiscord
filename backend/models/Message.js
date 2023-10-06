const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sent_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message_content: { type: String, required: true },
    date_messaged: { type: Date }
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);