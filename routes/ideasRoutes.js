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
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createComment,
  getCommentsbyIdeaId,
} from "../controllers/commentsController.js";

const router = express.Router();

router.get("/", getIdeas);
router.get("/:iid", getIdeaById);
router.get("/user/:uid", getIdeasByUserId);

router.get("/:iid/comments", getCommentsbyIdeaId);

router.use(requireAuth);

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").not().isEmpty()],
  createIdea
);

router.patch(
  "/:iid",
  [check("title").not().isEmpty(), check("description").not().isEmpty()],
  updateIdea
);

router.delete("/:iid", deleteIdea);

router.post("/:iid/comment", [check("content").not().isEmpty()], createComment);

export { router as ideasRoutes };
