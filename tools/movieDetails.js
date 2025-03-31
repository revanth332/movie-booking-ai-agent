import { createTool } from "@mastra/core";
import { z} from 'zod';
import { poolPromise } from "../src/app/v1/utils/dbConnection.js";

const DESCRIPTION = `
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

CREATE TABLE "theater" (
  "theater_id" varchar(36) NOT NULL,
  "theater_name" varchar(100) DEFAULT NULL,
  "email" varchar(100) DEFAULT NULL,
  "phone" varchar(10) DEFAULT NULL,
  "capacity" int DEFAULT NULL,
  "city" varchar(50) DEFAULT NULL,
  "theater_address" varchar(100) DEFAULT NULL,
  "password" varchar(100) DEFAULT NULL,
  PRIMARY KEY ("theater_id")
)

CREATE TABLE "theater_movie" (
  "theater_movie_id" varchar(36) NOT NULL,
  "theater_id" varchar(36) DEFAULT NULL,
  "movie_id" varchar(36) DEFAULT NULL,
  "price" decimal(5,2) DEFAULT NULL,
  "date" date DEFAULT NULL,
  PRIMARY KEY ("theater_movie_id"),
  KEY "theater_id" ("theater_id"),
  KEY "movie_id" ("movie_id"),
  CONSTRAINT "theater_movie_ibfk_1" FOREIGN KEY ("theater_id") REFERENCES "theater" ("theater_id") ON DELETE CASCADE,
  CONSTRAINT "theater_movie_ibfk_2" FOREIGN KEY ("movie_id") REFERENCES "movie" ("movie_id") ON DELETE CASCADE
)

CREATE TABLE "theater_movie_time" (
  "theater_movie_time_id" varchar(36) NOT NULL,
  "theater_movie_id" varchar(36) DEFAULT NULL,
  "time" time DEFAULT NULL,
  PRIMARY KEY ("theater_movie_time_id"),
  KEY "theater_movie_id" ("theater_movie_id"),
  CONSTRAINT "theater_movie_time_ibfk_1" FOREIGN KEY ("theater_movie_id") REFERENCES "theater_movie" ("theater_movie_id") ON DELETE CASCADE
)

CREATE TABLE "booking" (
  "booking_id" varchar(36) NOT NULL,
  "booking_date" date DEFAULT NULL,
  "user_id" varchar(36) DEFAULT NULL,
  "status_id" int DEFAULT NULL,
  "theater_movie_time_id" varchar(36) DEFAULT NULL,
  PRIMARY KEY ("booking_id"),
  KEY "user_id" ("user_id"),
  KEY "status_id" ("status_id"),
  KEY "theater_movie_time_id" ("theater_movie_time_id"),
  CONSTRAINT "booking_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE CASCADE,
  CONSTRAINT "booking_ibfk_2" FOREIGN KEY ("status_id") REFERENCES "status" ("status_id") ON DELETE CASCADE,
  CONSTRAINT "booking_ibfk_3" FOREIGN KEY ("theater_movie_time_id") REFERENCES "theater_movie_time" ("theater_movie_time_id") ON DELETE CASCADE
)

CREATE TABLE "booking_details" (
  "booking_details_id" varchar(36) NOT NULL,
  "booking_id" varchar(36) DEFAULT NULL,
  "seat_id" varchar(36) DEFAULT NULL,
  PRIMARY KEY ("booking_details_id"),
  KEY "booking_id" ("booking_id"),
  KEY "seat_id" ("seat_id"),
  CONSTRAINT "booking_details_ibfk_1" FOREIGN KEY ("booking_id") REFERENCES "booking" ("booking_id") ON DELETE CASCADE,
  CONSTRAINT "booking_details_ibfk_2" FOREIGN KEY ("seat_id") REFERENCES "seat" ("seat_id") ON DELETE CASCADE
)

CREATE TABLE "user" (
  "user_id" varchar(36) NOT NULL,
  "first_name" varchar(100) DEFAULT NULL,
  "last_name" varchar(100) DEFAULT NULL,
  "phone" varchar(10) DEFAULT NULL,
  "email" varchar(100) DEFAULT NULL,
  "password" varchar(500) DEFAULT NULL,
  PRIMARY KEY ("user_id")
)

CREATE TABLE "status" (
  "status_id" int NOT NULL,
  "status_name" varchar(20) DEFAULT NULL,
  PRIMARY KEY ("status_id")
)
** Status tabe contains 3 statuses : 1 for booked, 2 for Cancelled, 3 for available

CREATE TABLE "seat" (
  "seat_id" varchar(36) NOT NULL,
  "theater_movie_time_id" varchar(36) DEFAULT NULL,
  "seat_nmber" int DEFAULT NULL,
  "status_id" int DEFAULT NULL,
  PRIMARY KEY ("seat_id"),
  KEY "theater_movie_time_id" ("theater_movie_time_id"),
  CONSTRAINT "seat_ibfk_1" FOREIGN KEY ("theater_movie_time_id") REFERENCES "theater_movie_time" ("theater_movie_time_id") ON DELETE CASCADE
)
`

export const movieDetails = createTool({
    id : "get-movie-details",
    description : DESCRIPTION + `Executes sql query to fetches the movie details based on Genre, name, rating, Actors based on the above schema.`,
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

export const bookMovie = createTool({
    id : "book-movie",
    description : DESCRIPTION + "Executes SQL query to book movie based on user input",
    inputSchema : z.object({
        moviBookingSqlquery : z.string(),
    }),
    execute : async ({context : {moviBookingSqlquery}}) => {
        console.log("booking movie using query : "+moviBookingSqlquery);
        const pool = await poolPromise;
        return {
            query : moviBookingSqlquery,
            movies : await pool.query(moviBookingSqlquery)
        }
    }
})