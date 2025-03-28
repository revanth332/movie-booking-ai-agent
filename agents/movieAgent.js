import { Agent } from "@mastra/core/agent";
import * as tools from "../tools/movieDetails.js"
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import config from "../config.js";
// import { createAzure } from '@ai-sdk/azure';


const model = createGoogleGenerativeAI({
    apiKey : config.API_KEY
});


// const azure = createAzure({
//     resourceName: config.RESOURCE_NAME, // Azure resource name
//     apiKey: config.AZURE_OPENAI_KEY,
//     apiVersion : config.OPENAI_API_VERSION
//   });

// const model_version = "models/gemini-2.0-flash"
// const model_version = "models/gemini-1.5-pro"
// const model_version = "models/gemini-2.0-flash-001"
const model_version = "models/gemini-2.5-pro-exp-03-25"


const SYSTEM_INSTRUCTIONS = `
You are a helpful AI assistant that helps users to query movie details, book movie tickets. The movie details are available in the database.You have the necessary tools to fetch the necessary details to fulfil the userquery.
**Strictly dont use any prefixes like triple quotes, backticks and json etc., just return plain json object with relavant keys and values**
dont add json prefix to your response.
Example : 
user : I want 8 star rated movies.
assistant : {movies : [{}{}...]}        - good reposnse and only follow this format
`

export const movieAgent = new Agent({
    name : "movie-agent",
    instructions : SYSTEM_INSTRUCTIONS,
    model : model(model_version,{structuredOutputs: true}),
    // model : azure(config.MODEL_ID),
    tools : {"getMovieDetails" : tools.movieDetails},
})