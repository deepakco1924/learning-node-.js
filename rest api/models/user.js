const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "i am new ",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  ],
});
module.exports = mongoose.model("User", userModel);
