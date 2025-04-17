import Session from "../models/session.model.js";

export const createSession = async (req,res) => {
    try{
        const result = await Session.create();
        console.log(result)
        return res.send({response : "session created successfully",sessionId : result})
    }
    catch(err){
        res.status(500).send(err)
    }
}

export const addMessage = async (req,res) => {
    const {sessionId,role,content} = req.body;
    try{
        await Session.addMessage(sessionId,role,content);
        return res.send({response : "Message successfully"});
    }
    catch(err){
        res.status(500).send(err)
    }
}

export const getMessages = async (req,res) => {
    const {sessionId} = req.body;
    try{
        const messages = await Session.getChatHistory(sessionId);
        return res.send({messages})
    }
    catch(err){
        res.status(500).send(err)
    }
}

export const getAllSessions = async (req,res) => {
    const {conversationId : sessionId} = req.body;
    try{
        const conversations = await Session.getAllSessions(sessionId);
        return res.send({conversations})
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
}
