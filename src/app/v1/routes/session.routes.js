import express from "express";
import { addMessage,createSession,getMessages } from "../controllers/session.controller.js";

const router = express.Router();

router.route("/create")
    .post(createSession);

router.route("/message/add")
    .post(addMessage);

router.route("/messages")
    .post(getMessages);

export default router;