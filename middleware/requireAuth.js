import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { User } from "../models/user.js";

export async function requireAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.creator = await User.findById(_id).select("_id");

    next();
  } catch (err) {
    return res.status(401).json({ error: "You must be logged in" });
  }
}
