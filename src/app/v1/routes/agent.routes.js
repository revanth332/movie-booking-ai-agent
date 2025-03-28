import express from "express";
import { getLatestStockPrice,completeChat } from "../controllers/agent.controller.js";

const router = express.Router();

router.route("/stockPrice")
    .post(getLatestStockPrice);

router.route("/chat")
    .post(completeChat)

export default router;