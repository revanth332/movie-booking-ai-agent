import { stockAgent } from "../../../../agents/stockAgent.js";
import { movieAgent } from "../../../../agents/movieAgent.js";

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
    const {query} = req.body;
    try{
        const result = await movieAgent.generate([{role:"user",content:query}]);
        console.log(result.text)
        return res.send({response : JSON.parse(result.text.substring(8,result.text.length-3))})
    }
    catch(err){
        res.status(500).send(err)
    }
}

