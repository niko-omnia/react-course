const express = require('express');
var morgan = require('morgan');

const app = express();
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

const persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  },
];

app.get('/api/persons', (req, res) => {
  res.send(persons);
});
app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) return res.status(400).json({ error: 'name & number fields are required' });
  if (req.body.name === "" || req.body.number === "") return res.status(400).json({ error: 'name & number fields are required' });

  const { name, number } = req.body;
  let person = { name: name, number: number, id: String(Number(persons[persons.length - 1].id) + 1) };

  const name_exists = persons.find((p) => p.name === person.name);
  if (name_exists) return res.status(400).json({ error: 'name must be unique' });

  persons.push(person);
  return res.status(201).json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const index = persons.findIndex(p => p.id === id);

  if (index !== -1) {
    const deleted = persons.splice(index, 1);
    return res.status(200).json(deleted[0]);
  } else {
    return res.sendStatus(404);
  }
});

app.get('/api/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people.<br></br>${new Date(Date.now())}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
