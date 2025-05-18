const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // User ke liye unique ID
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true }
    }
  ]
}, { timestamps: true });

const ChatHistory = mongoose.model("ChatHistory", chatSchema);
module.exports = ChatHistory;
