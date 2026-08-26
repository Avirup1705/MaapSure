import express from "express";
import {
  createInstrument,
  getInstrumentById,
  getAllInstruments,
  addFeedback,
} from "../controllers/instrumentController.js";

const router = express.Router();

router.post("/", createInstrument);
router.get("/", getAllInstruments);
router.get("/:instrumentId", getInstrumentById);
router.post("/:instrumentId/feedback", addFeedback);

export default router;
