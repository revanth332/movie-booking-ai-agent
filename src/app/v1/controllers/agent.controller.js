import { stockAgent } from "../../../../agents/stockAgent.js";
import { movieAgent } from "../../../../agents/movieAgent.js";
import * as amcAgent from "../../../../agents/amcAgent.js";
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

// export const completeChat = async (req,res) => {
//     var {sessionId,query} = req.body;
//     console.log(sessionId);

//     const schema = z.object({
//         text : z.array(z.string()),
//         data : z.array(z.string()).optional()
//     })

//     try{
//         if(!sessionId){
//             sessionId = await Session.create();
//         }
//         const messages = await Session.getChatHistory(sessionId);
//         const result = await movieAgent.generate([...messages,{role:"user",content:query}],{ output: schema });
//         console.log(result.object)

//         await Session.addMessage(sessionId,"user",query);
//         await Session.addMessage(sessionId,"assistant",JSON.stringify(result.object));
//         return res.send({...result.object,sessionId});
//         // return res.send({response,sessionId});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send(err)
//     }
// }

export const completeChat = async (req,res) => {
    var {conversationId : sessionId,query} = req.body;
    console.log(sessionId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const schema = z.object({
        text : z.array(z.string()),
        data : z.array(z.string()).optional()
    })

    try{
        if(!sessionId){
            sessionId = await Session.create();
        }
        const messages = await Session.getChatHistory(sessionId);
        
        const result = await amcAgent.generate([...messages,{role:"user",content:query}]);
        // console.log(result.object)

        // await Session.addMessage(sessionId,"user",query);
        // await Session.addMessage(sessionId,"assistant",result);
        // return res.send({...result.object,sessionId});

        for await (const chunk of result.textStream) {
            res.write(`data: ${chunk}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    }
    catch(err){
        console.log(err);
        res.status(500)
        res.write(`data: [ERROR] ${err.message}\n\n`);
        res.end();
    }
}

export const createConversationTitle = async (req,res) => {
    const {query,conversationId} = req.body;

    try{
        const title = await amcAgent.createTitle(query);
        await Session.setSessionTitle(title,conversationId);
        res.send({title});
    }
    catch(err){
        res.status(500).send(err);
    }
}