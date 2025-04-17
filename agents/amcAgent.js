import * as tools from "../tools/movieDetails.js"
import config from "../config.js";
import { createAzure } from "@ai-sdk/azure";
import { generateText,streamText } from 'ai';
import { equipmentStatusExtractionTool } from "../tools/amcTools.js";
import { createGoogleGenerativeAI } from '@ai-sdk/google';


// const azure = createAzure({
//     resourceName: config.RESOURCE_NAME, 
//     apiKey: config.AZURE_OPENAI_KEY,
// })

// const model = azure(config.MODEL_ID);

const gemini = createGoogleGenerativeAI({
    apiKey : config.API_KEY
});
// const model_version = "models/gemini-2.5-pro-exp-03-25"
const model_version = "models/gemini-1.5-pro"

const model = gemini(model_version);

export const generate = async (messages) => {
    const systemMessage = {
        role : "system",
        content : "You are a proffesional AI assistant that answers the user queries related to equipment status. You have the file 'equipment_status.csv' containg the details about the equipment. Your soul purpose is to call the necessary tool and reply the relavant answer to the user. Use markdown for formatting the response hilighting key terminologies."
    }
    console.log(tools.equipmentStatusExtractionTool)
    const response = await streamText({
        model,
        messages : [systemMessage, ...messages],
        tools : {
            equipmentStatusExtractionTool
        },
        maxSteps : 2
    })
    console.log("response",response.textStream);
    return {
        textStream : response.textStream
    };
}

export const createTitle = async (query) => {
    const response = await generateText({
        model,
        prompt : "Generate one relavant title with just 2-3 words in plain text for a conversation based on the question : " + query + ". Dont add any prefixes or suffixes just give me the plain title that it."
    });
    return response.text;
}