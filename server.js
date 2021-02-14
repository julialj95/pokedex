require("dotenv").config();
const express = require("express");

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const POKEDEX = require("./pokedex.json");

const app = express();
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  const response = POKEDEX.pokemon;
  const { name, type } = req.query;

  let returnedList;
  if (name) {
    returnedList = response.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (type) {
    returnedList = response.filter((pokemon) => pokemon.type.includes(type));
  }

  res.json(returnedList);
}

app.get("/pokemon", handleGetPokemon);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = app.env.PORT || 8000;

app.listen(PORT);
