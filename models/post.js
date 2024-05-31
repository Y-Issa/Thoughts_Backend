import mongoose from "mongoose";
import UniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  // creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  creator: { type: String, required: true },
});

postSchema.plugin(UniqueValidator);

export const Post = mongoose.model("Post", postSchema);
