import express from "express";
import { getUsers, signup } from "../controllers/usersController.js";
import { check } from "express-validator";

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

export { router as usersRoutes };
