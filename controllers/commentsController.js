import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { Comment } from "../models/comment.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";

import HttpError from "../models/htpp-error.js";

export async function createComment(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { content, creator } = req.body;
  const postId = req.params.iid;
  const createdComment = new Comment({
    content,
    creator,
    post: postId,
  });

  let user;
  let post;

  try {
    user = await User.findById(creator);
    post = await Post.findById(postId);

    if (!user || !post) {
      return next(
        new HttpError("Could not find user or post for provided id.", 404)
      );
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });

    user.comments.push(createdComment);
    post.comments.push(createdComment);

    await user.save({ session: sess });
    await post.save({ session: sess });

    await sess.commitTransaction();

    res.status(201).json({ comment: createdComment });
  } catch (err) {
    return next(
      new HttpError("Creating comment failed, please try again later.", 500)
    );
  }
}

export async function getCommentsbyIdeaId(req, res, next) {
  const postId = req.params.iid;
  let comments;
  try {
    comments = await Comment.find({ post: postId }).populate({
      path: "creator",
      select: "-password",
    });

    if (!comments) {
      return next(
        new HttpError("Could not find comments for the provided post id.", 404)
      );
    }

    res.json({
      comments: comments.map((comment) => comment.toObject({ getters: true })),
    });
  } catch (err) {
    return next(
      new HttpError("Fetching comments failed, please try again later.", 500)
    );
  }
}
