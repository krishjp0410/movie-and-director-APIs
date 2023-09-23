const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
module.exports = app;
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Servet Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// API 1

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT 
      movie_name
    FROM 
      movie;`;
  const movies = await db.all(getMoviesQuery);
  response.send(movies);
});

//API 2

app.post("/movies/", async (request, response) => {
  const movieDetalis = request.body;
  const { directorId, movieName, leadActor } = movieDetalis;
  const addMovieQuery = `
    INSERT INTO 
      movie (director_id, m"ovie_name, lead_actor)
    VALUES 
      (
          ${directorId},
          ${movieName},
          ${leadActor}
      );`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
      *
    FROM 
      movie 
    WHERE 
      movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const updateMovieQuery = `
    UPDATE 
      movie
    SET 
       director_id = ${directorId},
       movie_name = ${movieName},
       lead_actor = ${leadActor}
       
    WHERE 
      movie_id = ${movieId};`;
  const movie = await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// API 5

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM 
      movie 
    WHERE 
      movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  const directorsQuery = `
    SELECT 
      * 
    FROM 
      director
    ORDER BY 
      director_id = ${directorId};`;
  const directors = await db.all(directorsQuery);
  response.send(directors);
});

//API 7

app.get("directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesQuery = `
  SELECT 
    *
  FROM movie
    FULL JOIN director 
    ON movie.director_id = director.director_id;`;
  const movieNameBySpecificDirector = await db.get(getMovieQuery);
  response.send(movieNameBySpecificDirector);
});
