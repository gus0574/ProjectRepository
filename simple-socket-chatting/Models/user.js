const mongoose = require("mongoose");

// db에 입력받을 구조 설계 
const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "User must type name"],
      unique: true,
   },
   token: {
      type: String,
   },
   online: {
      type: Boolean,
      default: false,
   },
});
module.exports = mongoose.model("User", userSchema);