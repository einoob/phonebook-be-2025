const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Person = require("./src/models/person");

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

const baseUrl = "/api/persons/";

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get(baseUrl, async (_req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get(`${baseUrl}:id`, async (req, res) => {
  const { id } = req.params;
  console.log("here 1");

  try {
    console.log("here");
    const person = await Person.findById(req.params.id);
    res.json(person);
  } catch (error) {
    res.status(404).json({ error: `Can't find person with id ${id}` });
  }
});

app.post(baseUrl, async (req, res) => {
  const { name, phonenumber } = req.body;
  console.log(name, phonenumber);

  if (!name || !phonenumber) {
    return res.status(400).json({ error: "Name or phonenumber missing" });
  }

  const person = new Person({
    name,
    phonenumber,
  });

  try {
    const savedPerson = await person.save();
    res.json(savedPerson);
  } catch (error) {
    res.status(500).json({ error: "Failed to save person" });
  }
});

app.delete(`${baseUrl}:id`, (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.get("/info", async (_req, res) => {
  const date = new Date();
  const amountOfPersons = await Person.find({}).length;
  const infoText = `Phonebook has info for ${amountOfPersons} people <br><br> ${date}`;
  res.send(infoText);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
