
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = { id: personToUpdate.id, name: personToUpdate.name, number: newNumber }
        personService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p))
            setMessageType('success')
            setMessage(`Updated number for ${returnedPerson.name}`)
            setTimeout(() => setMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessageType('error')
            setMessage(`Information of ${updatedPerson.name} has already been removed from server`)
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== updatedPerson.id))
          })
      }
      return
    }
    
    const nameObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessageType('success')
        setMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setMessageType('error')
        setMessage(error.response.data.error)
        setTimeout(() => setMessage(null), 5000)
        console.log(error.response.data.error)
      })
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
        onSubmit={addName}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App