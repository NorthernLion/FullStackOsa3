const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p> ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'There is no entry matching the given id'})
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const id = Number(req.params.id)
  const updatedPerson = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.map(person => person.id !== id ? person : updatedPerson)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  /*
  if (persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length > 0) {
    return res.status(400).json({error: `name must be unique`})
  }
  */
  if (body.number === undefined) {
    return res.status(400).json({error: `number missing`})
  }
  if (body.name === undefined) {
    return res.status(400).json({error: `name missing`})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
})

const generateId = () => {
  return (Math.random() * Math.floor(9999999999999999))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
