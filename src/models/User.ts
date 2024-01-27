import { Schema, model, models } from "mongoose";
import isEmail from "validator/lib/isEmail";

const UserSchema = new Schema({
  // userType: {
  //   type: String,
  //   required: [true, "Please select account type!"],
  // },
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
    validate: [isEmail, "Please enter a valid email address"],
  },
  discourseId: {
    type: Number,
    required: [true, "Discourse Account needed to create account!"],
  },
  progress: {
    type: Number,
    default: 1,
  },
  avatar: {
    type: String,
  },
  username: {
    type: String,
    unique: [true, "Username already exists!"],
    required: [true, "Please enter your username!"],
  },
  // password: {
  //   type: String,
  //   required: [true, "Please enter your password"],
  //   select: false,
  // },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;

//   ? 2 sizes for avatar img {96} or {288}
