const { connection, person } = require('./mongo');
const mongodb = {
    connection: connection,
    person: person
};

let persons_list = [
  {
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
];

async function add_persons() {
    await mongodb.connection.start();
    for (const person of persons_list) {
        if (await mongodb.person.findByName(person.name)) continue;
        await mongodb.person.create(person.name, person.number);
    }
}

(async () => {
    await add_persons();
})();
