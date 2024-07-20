const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must put a name"]
  },
  email: {
    type: String,
    required: [true, "You must add an email"]
  },
  password: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
