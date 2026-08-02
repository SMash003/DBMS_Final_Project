import { Router } from "express";
import {
  getCriminals,
  getCriminalById,
  createCriminal,
  updateCriminal,
} from "../controllers/criminalController.js";

const router = Router();

router.get("/", getCriminals);
router.get("/:id", getCriminalById);
router.post("/", createCriminal);
router.put("/:id", updateCriminal);

export default router;