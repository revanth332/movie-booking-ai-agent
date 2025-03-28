import { Agent } from "@mastra/core/agent";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import * as tools from "../tools/stockPrices.js"
import config from "../config.js";
import { createAzure } from '@ai-sdk/azure';


const model = createGoogleGenerativeAI({
    apiKey : config.API_KEY
});
const model_version = "models/gemini-2.5-pro-exp-03-25"
// const model_version = "models/gemini-1.5-pro"
// const model_version = "models/gemini-2.0-flash-001"

// const azure = createAzure({
//     resourceName: config.RESOURCE_NAME, // Azure resource name
//     apiKey: config.AZURE_OPENAI_KEY,
//     apiVersion : config.OPENAI_API_VERSION
//   });

// model = model("models/gemini-1.5-pro", {
//     structuredOutputs: false,
// })

const SYSTEM_INSTRUCTIONS = `
You are a helpful AI assistant that provides current stock prices. When asked about a task use the stockPrices tool to fetch the stock price.Your response should be a json object with keys symbol,price and their correspoding values.
**Strictly dont use any prefixes like triple quotes, backticks and 'json' etc., just return plain json object.
Example :
user : I want the stock price for uber.
assistant : {symbol : "UBER","price" : 74.45 } - good response
assistant : json{symbol : "UBER","price" : 74.45 } - bad response
`

export const stockAgent = new Agent({
    name : "stock-agent",
    instructions : SYSTEM_INSTRUCTIONS,
    model : model(model_version,{structuredOutputs: true}),
    // model : azure(config.MODEL_ID),
    tools : {"getStockPrices" : tools.stockPrices},
})

