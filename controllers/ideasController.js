import { validationResult } from "express-validator";
import HttpError from "../models/htpp-error.js";
import { Post } from "../models/post.js";

export async function getIdeas(req, res, next) {
  let ideas;
  try {
    ideas = await Post.find();
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
    ideas = await Post.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Fetching ideas failed, please try again later.", 500)
    );
  }

  if (!ideas || ideas.length === 0) {
    return next(
      new HttpError("Could not find ideas for the provided user id.", 404)
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

  const { title, description, tags, creator } = req.body;
  const createdIdea = new Post({
    title,
    description,
    tags,
    creator,
  });

  try {
    await createdIdea.save();
  } catch (err) {
    return next(new HttpError("Creating idea failed, please try again.", 500));
  }

  res.status(201).json({ idea: createdIdea });
}

export async function updateIdea(req, res, next) {}

export async function deleteIdea(req, res, next) {
  const ideaId = req.params.iid;
  let idea;
  try {
    idea = await Post.findById(ideaId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete idea.", 500)
    );
  }

  if (!idea) {
    return next(new HttpError("Could not find idea for this id.", 404));
  }

  try {
    await idea.deleteOne({ _id: ideaId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete idea.", 500)
    );
  }
}
