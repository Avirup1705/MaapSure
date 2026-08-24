import express from "express";
import {
  createInstrument,
  getInstrumentById,
  getAllInstruments,
} from "../controllers/instrumentController.js";

const router = express.Router();

router.post("/", createInstrument);
router.get("/", getAllInstruments);
router.get("/:instrumentId", getInstrumentById);

export default router;
