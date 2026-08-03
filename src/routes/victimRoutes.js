import { Router } from "express";
import {
  createVictim,
  getVictims,
  getVictimById,
  updateVictim,
  deleteVictim,
} from "../controllers/victimController.js";

const router = Router();

router.post("/", createVictim);
router.get("/", getVictims);
router.get("/:id", getVictimById);
router.put("/:id", updateVictim);
router.delete("/:id", deleteVictim);

export default router;