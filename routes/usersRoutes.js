import express from "express";
import { check } from "express-validator";
import {
  getUsers,
  login,
  signup,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

router.patch("/:uid", [check("name").not().isEmpty()], updateUser);

export { router as usersRoutes };
