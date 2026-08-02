import express from "express";
import {
  createOfficer,
  getAllOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} from "../controllers/officerController.js";

const router = express.Router();

router.post("/", createOfficer);
router.get("/", getAllOfficers);
router.get("/:id", getOfficerById);
router.put("/:id", updateOfficer);
router.delete("/:id", deleteOfficer);

export default router;