import { Router } from "express";
import {
  createCourtCase,
  getCourtCases,
  getCourtCaseById,
  updateCourtCase,
} from "../controllers/courtCaseController.js";

const router = Router();

router.post("/", createCourtCase);
router.get("/", getCourtCases);
router.get("/:id", getCourtCaseById);
router.put("/:id", updateCourtCase);

export default router;