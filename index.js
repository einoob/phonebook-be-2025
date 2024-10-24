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

app.get(`${baseUrl}:id`, async (req, res, next) => {
  const { id } = req.params;

  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      res.status(404).json(`Can't find person with id ${id}`).end();
    } else {
      res.json(person);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.post(baseUrl, async (req, res, next) => {
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
    next(error);
  }
});

app.delete(`${baseUrl}:id`, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Person.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.put(`${baseUrl}:id`, async (req, res, next) => {
  const { name, phonenumber } = req.body;
  const { id } = req.params;

  const person = {
    name,
    phonenumber,
  };

  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, person, { new: true });
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.get("/info", async (_req, res) => {
  const date = new Date();
  const persons = await Person.find({});
  const amountOfPersons = persons.length;
  const infoText = `Phonebook has info for ${amountOfPersons} people <br><br> ${date}`;
  res.send(infoText);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);
  const { value } = error;
  if (error.name === "CastError") {
    return response.status(400).send({ error: `Malformatted id ${value}` });
  }

  next(error);
};

app.use(errorHandler);
