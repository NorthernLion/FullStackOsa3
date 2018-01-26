import React from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from "./services/persons"
import Notification from "./components/Notification";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      search: '',
      notification: null
    }
  }

  componentWillMount() {
    personService
      .getAll()
      .then(persons => {
        this.setState({ persons })
      })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  handleNameChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value })
  }

  notify = (notification) => {
    this.setState({ notification })
    setTimeout(() => {
      this.setState({ notification: null })
    }, 5000)
  }


  removePerson = (id) => () => {
    const person = this.state.persons.find(person => person.id === id)
    const ok = window.confirm(`Poistetaanko ${person.name}`)
    if (!ok) {
      return
    }

    personService
      .remove(id)
      .then(response => {
        this.setState({
          persons: this.state.persons.filter(person => person.id !== id)
        })
        this.notify(`${person.name} removed`)
      })
  }

  updatePhone = (id) => {
    const name = this.state.newName
    const number = this.state.newNumber

    const ok = window.confirm(`${name} on jo luettelossa, korvataanko vanha numero uudella?`)
    if (!ok) {
      this.setState({
        newName: '',
        newNumber: ''
      })
      return
    }

    personService
      .update(id, { name, number })
      .then(updatedPerson => {
        this.setState({
          persons: this.state.persons.map(person => person.id !== id ? person : updatedPerson),
          newName: '',
          newNumber: ''
        })
        this.notify(`${updatedPerson.name} number updated`)
      })
      .catch(error => {
        this.createNewPerson({ name, number })
      })
  }

  addPerson = (event) => {
    event.preventDefault()

    const name = this.state.newName
    const number = this.state.newNumber

    const existingPerson = this.state.persons.find(person => person.name.toLowerCase() === name.toLowerCase())
    if (existingPerson) {
      this.updatePhone(existingPerson.id)
    } else {
      this.createNewPerson({ name, number })
    }
  }

  createNewPerson = (person) => {
    personService
      .create(person)
      .then(person => {
        this.setState({
          persons: this.state.persons.filter(p => p.id !== person.id).concat(person),
          newName: '',
          newNumber: ''
        })
        this.notify(`${person.name} added`)
      })
  }

  render() {
    const bySearchTerm = (person) => {
      if (this.state.search.length === 0) {
        return true
      }

      return person.name.toLowerCase().includes(this.state.search.toLowerCase())
    }

    const personsToShow = this.state.persons.filter(bySearchTerm)

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification message={this.state.notification} />
        <div>
          rajaa näytettäviä
          <input
            onChange={this.handleSearchChange}
            value={this.state.search}
          />
        </div>
        <PersonForm
          addPerson={this.addPerson}
          handleNumberChange={this.handleNumberChange}
          handleNameChange={this.handleNameChange}
          newName={this.state.newName}
          newNumber={this.state.newNumber}
        />
        <Persons
          persons={personsToShow}
          removePerson={this.removePerson}
        />
      </div>
    )
  }
}

export default App