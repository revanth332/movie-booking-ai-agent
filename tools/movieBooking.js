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
Executes sql query to fetches the movie details based on Genre, name, rating, Actors based on the above schema.
**Dont use qny quotes while accessing table fields.
Example :
tm.date   -> right way 
tm."date" -> bad way
`

async function bookMovie(bookingData) {
  const { userId, seats, theaterTimeMovieId } = bookingData;

  console.log("hello");
  console.log(bookingData);
  try {
    if (userId === "" || seats.length === 0 || theaterTimeMovieId === "") {
      throw { status: StatusCodes.BAD_REQUEST, msg: "Invalid booking data" };
    }

    const pool = await poolPromise;
    const bookingId = uuid.v4();
    await pool.query(`insert into booking values (?,?,?,?,?)`, [
      bookingId,
      new Date(),
      userId,
      1,
      theaterTimeMovieId,
    ]);
    const paramList = [];
    seats.forEach((seatId) => {
      paramList.push([uuid.v4(), bookingId, seatId]);
    });
    await pool.query("insert into booking_details values ?", [paramList]);
    const response = await pool.query(
      "update seat set status_id = 1 where seat_id in (?)",
      [seats]
    );
    console.log(response);
    return { status: StatusCodes.OK, msg: "Successfully booked movie" };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const bookMovie = createTool({
    id : "book-movie",
    description : DESCRIPTION,
    inputSchema : z.object({
        userId : z.string(),
        seatIds : z.array(z.string()),
        theaterTimeMovieId : z.string()
    }),
    execute : async ({context : {userId,seatIds,theaterTimeMovieId}}) => {
        console.log("booking movie using query : "+moviBookingSqlquery);
        return {
            query : moviBookingSqlquery,
            movies : await bookMovie(userId,seatIds,theaterTimeMovieId)
        }
    }
})