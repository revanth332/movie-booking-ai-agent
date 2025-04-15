import { stockAgent } from "../../../../agents/stockAgent.js";
import { movieAgent } from "../../../../agents/movieAgent.js";
import Session from "../models/session.model.js";
import { z } from "zod";

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
    var {sessionId,query} = req.body;
    console.log(sessionId);

    const schema = z.object({
        text : z.array(z.string()),
        data : z.array(z.string()).optional()
    })

    try{
        if(!sessionId){
            sessionId = await Session.create();
        }
        const messages = await Session.getChatHistory(sessionId);
        const result = await movieAgent.generate([...messages,{role:"user",content:query}],{ output: schema });
        console.log(result.object)

        await Session.addMessage(sessionId,"user",query);
        await Session.addMessage(sessionId,"assistant",JSON.stringify(result.object));
        return res.send({...result.object,sessionId});
        // return res.send({response,sessionId});
    }
    catch(err){
        console.log(err);
        res.status(500).send(err)
    }
}

