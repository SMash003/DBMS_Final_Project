import { Router } from "express";
import {
  createArrest,
  getArrests,
  getArrestById,
  updateArrest,
} from "../controllers/arrestController.js";

const router = Router();

router.post("/", createArrest);
router.get("/", getArrests);
router.get("/:id", getArrestById);
router.put("/:id", updateArrest);

export default router;