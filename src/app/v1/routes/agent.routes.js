import express from "express";
import { getLatestStockPrice,completeChat,createConversationTitle } from "../controllers/agent.controller.js";

const router = express.Router();

router.route("/stockPrice")
    .post(getLatestStockPrice);

router.route("/chat")
    .post(completeChat)

router.route("/conversation/create/title")
    .post(createConversationTitle)

export default router;