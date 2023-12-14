const mongoose = require("mongoose");

// chat message DAO 느낌
const chatSchema = new mongoose.Schema({
   chat: String,
   user: {
      id: {
         type: mongoose.Schema.ObjectId,
         ref: "User",
      },
      name: String,
   },
}, { timestamp: true});
module.exports = mongoose.model("Chat", chatSchema);