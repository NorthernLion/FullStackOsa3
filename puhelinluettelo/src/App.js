import React from 'react'
import Persons from './components/Persons'
import PersonsForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

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

  handleSearchChange = (event) => {
    this.setState({ search: event.target.value })
  }

  handlePersonChange = (event) => {
    this.setState({ newName: event.target.value })
  }

  handleNumberChange = (event) => {
    this.setState({ newNumber: event.target.value })
  }

  notify = (notification) => {
    this.setState({ notification })
    setTimeout(() => {
      this.setState({ notification: null })
    }, 3000)
  }

  addPerson = (event) => {
    event.preventDefault()

    const name = this.state.newName
    const number = this.state.newNumber

    const existingPerson = this.state.persons.find(person => person.name === name)
    if (existingPerson) {
      this.updatePhone(existingPerson.id)
    } else {
      this.createNewPerson({ name, number })
    }

  }

  updatePhone = (id) => {
    const name = this.state.newName
    const number = this.state.newNumber

    this.setState({
      newName: '',
      newNumber: ''
    })

    if (window.confirm(`${name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
      personService
        .update(id, { name, number })
        .then(updatedPerson => {
          this.setState({ persons: this.state.persons.map(person => person.id !== id ? person : updatedPerson) })
          this.notify(`${updatedPerson.name} number updated`)
        })
        .catch(error => {
          this.createNewPerson({ name, number })
        })
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

  removePerson = (id) => () => {
    const person = this.state.persons.find(person => person.id === id)
    if (window.confirm(`poistetaanko ${person.name}`)) {
      personService
        .remove(id)
        .then(newPerson => {
          this.setState({
            persons: this.state.persons.filter(person => person.if !== id)
          })
          this.notify(`${person.name} removed`)
        })
    }
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
        <PersonsForm
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
