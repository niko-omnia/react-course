import { useEffect, useState } from 'react'
import json_server from "./services/json_server.js"
import Notification from './components/Notification'

const timeoutClear = (set, ms) => {
  setTimeout(() => {
    set("")
  }, ms);
}

const Filter = ({ set }) => {
  return (
    <p>
      Filter:
      <input onChange={(e) => set(e.target.value)}></input>
    </p>
  )
}

const PersonForm = ({ props }) => {
  return (
    <form onSubmit={(e) => props.addPerson(e)}>
      <div>
        <p>
          name:
          <input value={props.newName} onChange={(e) => props.setNewName(e.target.value)} />
        </p>
        <p>
          number:
          <input value={props.newNumber} onChange={(e) => props.setNewNumber(e.target.value)} />
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
        if (filter.length > 0 & !person.name.toLocaleLowerCase().includes(filter.toLowerCase())) return
        return (
          <p key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person)}>Delete</button>
          </p>
        )
      })}
    </div>
  )
}

const fetchPersons = (setPersons) => {
  json_server.getAll()
    .then(response => {
      setPersons(response.data)
    })
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState()
  const [successMessage, setSuccessMessage] = useState()
  const [persons, setPersons] = useState([])

  useEffect(() => {
    fetchPersons(setPersons)
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return
    json_server.deleteId(person.id)
      .then(r => {
        setPersons(prev => prev.filter(p => p.id !== r.data.id))
        setSuccessMessage(`Person deleted from the phonebook!`)
        timeoutClear(setSuccessMessage, 5000)
        setNewName('')
        setNewNumber('')
      })
  }

  const editPerson = (person) => {
    if (persons.filter(p => p === person.id)) {
      if (!window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) return
      
      json_server.update(person.id, { name: person.name, number: newNumber, id: person.id })
        .then(response => {
          setSuccessMessage(`Number updated!`)
          timeoutClear(setSuccessMessage, 5000)
          setPersons(prev => prev.map(p => p.id === response.data.id ? response.data : p))
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          setErrorMessage(`Information of ${person.name} has already been removed from the server`)
          timeoutClear(setErrorMessage, 5000)
          setPersons(prev => prev.filter(p => p.id != person.id))
        })
    }
  }

  const addPerson = (e) => {
    e.preventDefault()
    
    if (newName === "" || newNumber === "") {
      setErrorMessage("Name & number must be filled to create a person in the phonebook!")
      timeoutClear(setErrorMessage, 5000)
      return
    }

    fetchPersons(setPersons)
    
    const person = persons.find((person) => person.name === newName)
    if (person) {
      if (person.number !== newNumber) {
        editPerson(person)
        return
      }

      setErrorMessage(`"${newName}" is already added to the phonebook`)
      timeoutClear(setErrorMessage, 5000)
      return
    }

    json_server.create({ name: newName, number: newNumber, id: (persons.length + 1).toString() })
      .then(response => {
        setPersons(prev => prev.concat(response.data))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added "${newName}" to the phonebook`)
        timeoutClear(setSuccessMessage, 5000)
      })
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
  )

}

export default App
