import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

import HttpError from "../models/htpp-error.js";
import { User } from "../models/user.js";

function createToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

export async function getUserById(req, res, next) {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return next(
      new HttpError("Fetching user failed, please try again later.", 500)
    );
  }
  if (!user) {
    return next(
      new HttpError("Could not find a user for the provided id.", 404)
    );
  }
  res.json({ user: user.toObject({ getters: true }) });
}

export async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, bio } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(
        new HttpError("User exists already, please login instead.", 422)
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = new User({
      name,
      email,
      bio,
      image: "",
      password: hash,
      posts: [],
    });

    await createdUser.save();

    const token = createToken(createdUser._id);

    res.status(201).json({
      user: (({ password, ...user }) => user)(
        createdUser.toObject({ getters: true })
      ),
      token,
    });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return next(new HttpError("Invalid email address.", 401));
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      return next(new HttpError("Invalid password provided.", 401));
    }

    const token = createToken(existingUser._id);

    res.json({
      user: (({ password, ...user }) => user)(
        existingUser.toObject({ getters: true })
      ),
      token,
    });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }
}

export async function updateUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, bio, image, oldPassword, newPassword } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return next(new HttpError("Invalid password", 401));

    user.name = name;
    if (bio) user.bio = bio;
    if (image) user.image = image;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      user.password = hash;
    }

    await user.save();

    const token = createToken(userId);

    res.status(200).json({
      user: (({ password, ...user }) => user)(user.toObject({ getters: true })),
      token,
    });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong, could not update user.", 500)
    );
  }
}
