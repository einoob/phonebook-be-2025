const express = require("express");

const app = express();

const persons = [
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

// app.delete("/api/persons/:id", (req, res) => {
//   persons = persons.filter(({ id }) => id !== req.params.id);

//   res.status(204).end()
// });

app.get("/info", (_req, res) => {
  const date = new Date();
  const infoText = `Phonebook has info for ${persons.length} people <br><br> ${date}`;
  res.send(infoText);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
