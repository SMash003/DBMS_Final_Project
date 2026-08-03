import { Router } from "express";
import {
  createSentence,
  getSentences,
  getSentenceById,
  updateSentence,
} from "../controllers/sentenceController.js";

const router = Router();

router.post("/", createSentence);
router.get("/", getSentences);
router.get("/:id", getSentenceById);
router.put("/:id", updateSentence);

export default router;