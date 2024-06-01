import mongoose from "mongoose";
import UniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  // posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  posts: [{ type: String }],
  joined: { type: Date, default: Date.now },
});

userSchema.plugin(UniqueValidator);

export const User = mongoose.model("User", userSchema);
