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
app.post('/api/persons', async (req, res) => {
  if (!req.body.name || !req.body.number) return res.status(400).json({ error: 'name & number fields are required' });
  if (req.body.name === "" || req.body.number === "") return res.status(400).json({ error: 'name & number fields are required' });

  const { name, number } = req.body;

  const name_exists = await mongodb.person.findByName(name);
  if (name_exists) return res.status(400).json({ error: 'name must be unique' });

  const person = await mongodb.person.create(name, number);
  return res.status(201).json(person);
});

app.put('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  const { number } = req.body;

  if (!number || number === "") return res.status(400).json({error: "Number is required to update!"});

  const updated = await mongodb.person.updateNumber(id, number);
  if (!updated) return res.status(400).json({error: "Invalid id!"});

  return res.status(200).json(updated);
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

app.delete('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  
  const deleted = await mongodb.person.delete(id);
  if (deleted) {
    return res.status(200).json(deleted);
  } else {
    return res.sendStatus(404);
  }
});

app.get('/api/info', async (req, res) => {
  const persons = await mongodb.person.getAll()
  return res.status(200).send(`Phonebook has info for ${persons.length} people.<br></br>${new Date(Date.now())}`);
});

app.listen(process.env.PORT, async () => {  
  await mongodb.connection.start();
  console.log(`Server running on port ${process.env.PORT}`);
});
