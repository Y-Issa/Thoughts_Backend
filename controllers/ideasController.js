import { validationResult } from "express-validator";
import HttpError from "../models/htpp-error.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";

export async function getIdeas(req, res, next) {
  let ideas;
  try {
    ideas = await Post.find().populate({
      path: "creator",
      select: "-password",
    });
  } catch (err) {
    return next(
      new HttpError("Fetching ideas failed, please try again later.", 500)
    );
  }

  res.json({
    ideas: ideas.map((idea) => idea.toObject({ getters: true })),
  });
}

export async function getIdeasByUserId(req, res, next) {
  const userId = req.params.uid;
  let ideas;
  try {
    ideas = await Post.find({ creator: userId }).populate({
      path: "creator",
      select: "-password",
    });

    if (!ideas || ideas.length === 0) {
      return next(new HttpError("No ideas shared yet!", 404));
    }
  } catch (err) {
    return next(
      new HttpError("Fetching ideas failed, please try again later.", 500)
    );
  }

  res.json({
    ideas: ideas.map((idea) => idea.toObject({ getters: true })),
  });
}

export async function getIdeaById(req, res, next) {
  const ideaId = req.params.iid;
  let idea;
  try {
    idea = await Post.findById(ideaId);
  } catch (err) {
    return next(
      new HttpError("Fetching idea failed, please try again later.", 500)
    );
  }
  if (!idea) {
    return next(
      new HttpError("Could not find an idea for the provided id.", 404)
    );
  }
  res.json({ idea: idea.toObject({ getters: true }) });
}

export async function createIdea(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, tags } = req.body;
  const creator = req.creator;
  const createdIdea = new Post({
    title,
    description,
    tags,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
    if (!user) {
      return next(new HttpError("Could not find user for provided id.", 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdIdea.save({ session: sess });
    user.posts.push(createdIdea);
    await user.save({ session: sess });
    await sess.commitTransaction();

    res.status(201).json({ idea: createdIdea });
  } catch (err) {
    return next(new HttpError("Creating idea failed, please try again.", 500));
  }
}

export async function updateIdea(req, res, next) {}

export async function deleteIdea(req, res, next) {
  const ideaId = req.params.iid;
  let idea;
  try {
    idea = await Post.findById(ideaId).populate("creator");

    if (!idea) {
      return next(new HttpError("Could not find idea for this id.", 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await idea.deleteOne({ _id: ideaId, session: sess });
    idea.creator.posts.pull(idea);
    await idea.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete idea.", 500)
    );
  }

  res.status(200).json({ message: "Deleted idea." });
}
