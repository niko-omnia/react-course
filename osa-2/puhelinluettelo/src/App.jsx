import { useState } from 'react'

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

const Persons = ({ persons, filter }) => {
  return (
    <div>
      {persons.map(person => {
        if (filter.length > 0 & !person.name.toLocaleLowerCase().includes(filter.toLowerCase())) return
        return (
          <p key={person.name}>{person.name} {person.number}</p>
        )
      })}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const addPerson = (e) => {
    e.preventDefault()
	
	if (newName === "" || newNumber === "") {
      return
    }
    
    if (persons.find((person) => person.name === newName)) {
        alert(`${newName} is already added to the phonebook`);
        return;
    }

    let newPersons = [...persons]
    newPersons.push({ name: newName, number: newNumber })
    setPersons(newPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter set={setFilter} />

      <h3>Add new number</h3>
      <PersonForm props={{ newName, newNumber, setNewName, setNewNumber, addPerson }} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App
