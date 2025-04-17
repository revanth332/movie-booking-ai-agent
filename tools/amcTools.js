import {tool} from "ai";
import fs from "fs/promises";
import z from "zod";

export const equipmentStatusExtractionTool  = tool({
    parameters : z.object({
        question : z.string().describe("question related to equipment status")
    }),
    execute : async ({question}) => {
        console.log("question",question);
        const data = await fs.readFile('./equipment_status.csv', 'utf8');
        return data;
    }
})