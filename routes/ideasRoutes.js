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

const router = express.Router();

router.get("/", getIdeas);
router.get("/:iid", getIdeaById);
router.get("/user/:uid", getIdeasByUserId);

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

export { router as ideasRoutes };
