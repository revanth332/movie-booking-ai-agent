import express from "express";
import { addMessage,createSession,getAllSessions,getMessages } from "../controllers/session.controller.js";

const router = express.Router();

router.route("/create")
    .post(createSession);

router.route("/message/add")
    .post(addMessage);

router.route("/messages")
    .post(getMessages);

router.route("/all")
    .post(getAllSessions);

export default router;