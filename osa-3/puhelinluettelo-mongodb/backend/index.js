const express = require('express');
var morgan = require('morgan');
const cors = require("cors");
require('dotenv').config()

const { connection, person } = require('./mongo');
const mongodb = {
    connection: connection,
    person: person
};

const app = express();
app.use(express.json());
app.use(cors());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.get('/api/persons', async (req, res) => {
  const persons = await mongodb.person.getAll();
  return res.status(200).json(persons);
});
app.post('/api/persons', async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.number) throw new Error("name & number fields are required");
    if (req.body.name === "" || req.body.number === "") throw new Error("name & number fields are required");

    const { name, number } = req.body;
    const name_exists = await mongodb.person.findByName(name);
    if (name_exists) throw new Error("name must be unique");

    try {
      const person = await mongodb.person.create(name, number);
      return res.status(201).json(person);
    } catch (error) {
      return res.status(400).json({ error });
    }
  } catch (err) {
    next(err);
    return res.status(400).json({ error: err });
  }
});

app.patch('/api/persons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number } = req.body;

    if (!number || number === "") throw new Error("Number is required to update!");

    const updated = await mongodb.person.updateNumber(id, number);
    if (!updated) throw new Error("Invalid id!");
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
    return res.status(400).json({ error: err });
  }
});

app.get('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  const person = await mongodb.person.findById(id);
  
  if (person) {
    return res.status(200).json(person);
  } else {
    return res.sendStatus(404);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
  
    const deleted = await mongodb.person.delete(id);
    if (deleted) {
      return res.status(200).json(deleted);
    } else {
      throw new Error(`Person with id "${id}" does not exist!`);
    }
  } catch (err) {
    next(err);
    return res.sendStatus(404);
  }
});

app.get('/api/info', async (req, res) => {
  const persons = await mongodb.person.getAll()
  return res.status(200).send(`Phonebook has info for ${persons.length} people.<br></br>${new Date(Date.now())}`);
});

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

app.listen(process.env.PORT, async () => {  
  await mongodb.connection.start();
  console.log(`Server running on port ${process.env.PORT}`);
});
