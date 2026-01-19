import { useEffect, useState } from 'react';
import Notification from './components/Notification';
import mongo_server from './services/mongo_server.js';

const timeoutClear = (set, ms) => {
  setTimeout(() => {
    set("");
  }, ms);
}

const Filter = ({ set }) => {
  return (
    <p>
      Filter:
      <input onChange={(e) => { set(e.target.value); }}></input>
    </p>
  )
}

const PersonForm = ({ props }) => {
  return (
    <form onSubmit={(e) => { props.addPerson(e); }}>
      <div>
        <p>
          name:
          <input value={props.newName} onChange={(e) => { props.setNewName(e.target.value); }} />
        </p>
        <p>
          number:
          <input value={props.newNumber} onChange={(e) => { props.setNewNumber(e.target.value); } } />
        </p>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, filter, deletePerson }) => {
  return (
    <div>
      {persons.map(person => {
        if (filter.length > 0 && !person.name.toLowerCase().includes(filter.toLowerCase())) return;
        return (
          <p key={person._id}>
            {person.name} {person.number}
            <button onClick={() => { deletePerson(person); }}>Delete</button>
          </p>
        );
      })}
    </div>
  );
}

const fetchPersons = (setPersons) => {
  mongo_server.getAll()
    .then(response => {
      setPersons(response.data);
    });
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetchPersons(setPersons);
  }, []);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  
  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;
    mongo_server.deleteId(person._id)
      .then(r => {
        setPersons(prev => prev.filter(p => p._id !== r.data._id));
        setSuccessMessage(`Person deleted from the phonebook!`);
        timeoutClear(setSuccessMessage, 5000);
        setNewName('');
        setNewNumber('');
      })
  }

  const editPerson = (person) => {
    if (persons.find(p => p._id === person._id)) {
      if (!window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) return;
      
      mongo_server.update(person._id, { name: person.name, number: newNumber, id: person._id })
        .then(response => {
          setSuccessMessage(`Number updated!`);
          timeoutClear(setSuccessMessage, 5000);
          setPersons(prev => prev.map(p => p._id === response.data._id ? response.data : p));
          setNewName('');
          setNewNumber('');
        })
        .catch((e) => {
          setErrorMessage(`Information of ${person.name} has already been removed from the server`);
          timeoutClear(setErrorMessage, 5000);
          setPersons(prev => prev.filter(p => p._id != person._id));
        });
    }
  }

  const addPerson = (e) => {
    e.preventDefault();
    
    if (newName === "" || newNumber === "") {
      setErrorMessage("Name & number must be filled to create a person in the phonebook!");
      timeoutClear(setErrorMessage, 5000);
      return;
    }

    const person = persons.find((person) => person.name === newName);
    if (person) {
      if (person.number !== newNumber) {
        editPerson(person);
        return;
      }

      setErrorMessage(`"${newName}" is already added to the phonebook`);
      timeoutClear(setErrorMessage, 5000);
      return;
    }

    console.log("Create");
    mongo_server.create({ name: newName, number: newNumber })
      .then((response) => {
        setPersons(prev => [...prev, response.data]);
        setSuccessMessage(`Added "${newName}" to the phonebook`);
        timeoutClear(setSuccessMessage, 5000);
        setNewName('');
        setNewNumber('');
      }).catch(async (req) => {
        if (req && req.response && req.response.data && req.response.data.error) {
          setErrorMessage(req.response.data.error.message);
          timeoutClear(setErrorMessage, 5000);
        }
      });
    console.log("done!");
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {errorMessage && <Notification message={errorMessage} className="error" />}
      {successMessage && <Notification message={successMessage} className="success" />}
      <Filter set={setFilter} />

      <h3>Add new number</h3>
      <PersonForm props={{ newName, newNumber, setNewName, setNewNumber, addPerson }} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
}

export default App;
