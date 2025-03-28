import {createTool} from '@mastra/core/tools';
import { z} from 'zod';

const getStockPrice = async (symbol) => {
    const data = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=9G7CUMVZQV62BECA`)
    .then(response => response.json());

    // console.log(data["Time Series (Daily)"][data["Meta Data"]["3. Last Refreshed"]]["4. close"])
    return data["Time Series (Daily)"][data["Meta Data"]["3. Last Refreshed"]]["4. close"]
}


export const stockPrices = createTool({
    id:"get-stock-prices",
    description : "Fetches the last day's closing stock price for a given symbol.",
    inputSchema : z.object({
        symbol : z.string()
    }),
    outputSchema : z.object({
        symbol : z.string(),
        currentPrice : z.string()
    }),
    execute : async ({context : {symbol}}) => {
        console.log(`Getting stock price for the symbol ${symbol}`);
        return {
            symbol,
            currentPrice : await getStockPrice(symbol)
        }
    }
})