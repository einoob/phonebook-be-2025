const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());
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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get("/api/persons", (_req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  res.send(persons.find(({ id }) => id === req.params.id));
});

app.post("/api/persons", (req, res) => {
  let person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  } else if (persons.find(({ name }) => name.toLowerCase() === person.name.toLowerCase())) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  person.id = Math.floor(Math.random() * 10000);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.get("/info", (_req, res) => {
  const date = new Date();
  const infoText = `Phonebook has info for ${persons.length} people <br><br> ${date}`;
  res.send(infoText);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
