import express from "express";
import { check } from "express-validator";
import {
  getUserById,
  getUsers,
  login,
  signup,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:uid", getUserById);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  login
);

router.patch(
  "/:uid",
  [check("name").not().isEmpty(), check("oldPassword").not().isEmpty()],
  updateUser
);

export { router as usersRoutes };
