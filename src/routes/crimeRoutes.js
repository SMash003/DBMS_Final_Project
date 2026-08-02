import express from "express";
import {
  createCrime,
  getAllCrimes,
  getCrimeById,
  updateCrime,
  deleteCrime,
} from "../controllers/crimeController.js";

const router = express.Router();

router.post("/", createCrime);
router.get("/", getAllCrimes);
router.get("/:id", getCrimeById);
router.put("/:id", updateCrime);
router.delete("/:id", deleteCrime);

export default router;