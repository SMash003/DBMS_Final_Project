import { Router } from "express";
import {
  createCriminalCase,
  getCriminalCases,
  getCriminalCaseById,
  updateCriminalCase,
  deleteCriminalCase,
} from "../controllers/criminalCaseController.js";

const router = Router();

router.post("/", createCriminalCase);
router.get("/", getCriminalCases);
router.get("/:id", getCriminalCaseById);
router.put("/:id", updateCriminalCase);
router.delete("/:id", deleteCriminalCase);