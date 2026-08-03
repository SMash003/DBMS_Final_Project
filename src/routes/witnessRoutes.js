import { Router } from "express";
import {
  createWitness,
  getWitnesses,
  getWitnessById,
  updateWitness,
  deleteWitness,
} from "../controllers/witnessController.js";

const router = Router();

router.post("/", createWitness);
router.get("/", getWitnesses);
router.get("/:id", getWitnessById);
router.put("/:id", updateWitness);
router.delete("/:id", deleteWitness);

export default router;