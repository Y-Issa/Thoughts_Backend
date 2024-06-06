import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  post: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
  created: { type: Date, default: Date.now },
});

export const Comment = mongoose.model("Comment", commentSchema);
