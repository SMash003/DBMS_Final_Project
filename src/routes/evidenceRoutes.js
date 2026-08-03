import { Router } from "express";
import {
  createEvidence,
  getEvidence,
  getEvidenceById,
  updateEvidence,
} from "../controllers/evidenceController.js";

const router = Router();

router.post("/", createEvidence);
router.get("/", getEvidence);
router.get("/:id", getEvidenceById);
router.put("/:id", updateEvidence);

export default router;