import express from "express";
import {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/stationController.js";

const router = express.Router();

router.post("/", createStation);
router.get("/", getAllStations);
router.get("/:id", getStationById);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

export default router;