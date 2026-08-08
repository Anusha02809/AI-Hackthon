import express from "express";
import { parseAddress } from "../controllers/addressController.js";

const router = express.Router();

router.post("/parse", parseAddress);

export default router;
