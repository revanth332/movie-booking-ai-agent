import { stockAgent } from "../../../../agents/stockAgent.js";
import { movieAgent } from "../../../../agents/movieAgent.js";
import Session from "../models/session.model.js";

export const getLatestStockPrice = async (req,res) => {
    const {query} = req.body;
    try{
        const result = await stockAgent.generate([{role:"user",content:query}]);
        console.log(result.text)
        return res.send({response : JSON.parse(result.text.substring(8,result.text.length-3))})
    }
    catch(err){
        res.status(500).send(err)
    }
}

export const completeChat = async (req,res) => {
    const {sessionId,query} = req.body;
    try{
        const messages = await Session.getChatHistory(sessionId);
        const result = await movieAgent.generate([...messages,{role:"user",content:query}]);
        // const movies = JSON.parse(result.text.substring(8,result.text.length-3));
        console.log(result.text + "kl");
        const response = result.text.includes("```json") ? result.text.substring(8,result.text.length-3) : result.text;

        await Session.addMessage(sessionId,"user",query);
        await Session.addMessage(sessionId,"assistant",response);
        return res.send(JSON.parse(response));
    }
    catch(err){
        console.log(err);
        res.status(500).send(err)
    }
}

