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
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'Could not reach database' })
    })
})

app.get('/info', (req, res) => {
  Person
    .count({})
    .then(length => {
      const infoMessage = `<p>puhelinluettelossa on ${length} henkilön tiedot</p> ${new Date()}`
      res.send(infoMessage)
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'Could not reach database' })
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'malformated id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformated id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformated id' })
    })
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
