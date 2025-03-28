import { createTool } from "@mastra/core";
import { z} from 'zod';
import { poolPromise } from "../src/app/v1/utils/dbConnection.js";

const DESCRIPTION = `
Movie Table Schema :
CREATE TABLE "movie" (
  "movie_id" varchar(36) NOT NULL,
  "movie_name" varchar(100) DEFAULT NULL,
  "description" text,
  "duration" time DEFAULT NULL,
  "rating" decimal(3,2) DEFAULT NULL,
  "genre" varchar(50) DEFAULT NULL,
  "poster_url" varchar(500) DEFAULT NULL,
  "actors" varchar(500) DEFAULT NULL,
  "release_date" varchar(30) DEFAULT NULL,
  "language" varchar(100) DEFAULT NULL,
  "director" varchar(100) DEFAULT NULL,
  PRIMARY KEY ("movie_id")
)
** Here genre contains 2 or more genres in a single string. Example : Comedy,Horror
Executes sql query to fetches the movie details based on Genre, name, rating, Actors based on the above schema.
`

export const movieDetails = createTool({
    id : "get-movie-details",
    description : DESCRIPTION,
    inputSchema : z.object({
        movieFetchingSqlquery : z.string(),
    }),
    execute : async ({context : {movieFetchingSqlquery}}) => {
        console.log("fetching movies using query : "+movieFetchingSqlquery);
        const pool = await poolPromise;
        return {
            query : movieFetchingSqlquery,
            movies : await pool.query(movieFetchingSqlquery)
        }
    }
})