import express from "express";
import { check } from "express-validator";

import {
  createIdea,
  deleteIdea,
  getIdeaById,
  getIdeas,
  getIdeasByUserId,
  updateIdea,
} from "../controllers/ideasController.js";

const router = express.Router();

router.get("/", getIdeas);
router.get("/:iid", getIdeaById);
router.get("/user/:uid", getIdeasByUserId);

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 8 })],
  createIdea
);

router.patch(
  "/:iid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 8 })],
  updateIdea
);

router.delete("/:iid", deleteIdea);

export { router as ideasRoutes };
