import express from "express";

import { getText, getSpeech } from "../controller/commController.js";

const router = express.Router();

router.post("/getText", getText);
router.post("/getSpeech", getSpeech);

export default router;
