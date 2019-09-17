const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    department: {
      type: String
    },
    role: {
      type: String,
      required: false,
      default: "student"
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/*
  Roles
  - student
  - admin
  - teacher
*/

module.exports = mongoose.model("User", userSchema);
