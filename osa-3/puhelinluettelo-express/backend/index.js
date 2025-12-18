const express = require('express');
const app = express();

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
    const { person } = req.body;
    
    if (!person["name"] || !person["number"]) return res.status(400).json({ error: 'name & number fields are required' });

    const name_exists = persons.find((p) => p.name === person.name);
    if (name_exists) return res.status(400).json({ error: 'name must be unique' });

    person["id"] = ((Number(persons[persons.length - 1])) + 1).toString();
    persons.push(person);
    return res.status(201).json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = persons.find((p) => p.id === id);
    if (person) {
        return res.status(200).json(person);
    } else {
        return res.sendStatus(404);
    }
});
app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = persons.find((p) => p.id === id);
    if (person) {
        persons.pop(person);
        return res.status(200).json(person);
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
