import { Router } from "express";
import {
  registerUser,
  getById,
  update,
  remove,
} from "../controllers/authController.js";

const router = Router();

router.post("/", registerUser);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;