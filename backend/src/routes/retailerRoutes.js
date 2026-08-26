import express from "express";
import {
  registerInstrument,
  loginRetailer,
  bookVerification,
} from "../controllers/retailerController.js";

const router = express.Router();

router.post("/register", registerInstrument);
router.post("/login", loginRetailer);
router.post("/:instrumentId/book-verification", bookVerification);

export default router;
