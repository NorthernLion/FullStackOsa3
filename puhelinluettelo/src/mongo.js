const mongoose = require('mongoose')

const url = 'mongodb://jasperli:1@ds039058.mlab.com:39058/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Peson', {
  id: String,
  name: String,
  number: String
})

const generateId = () => {
  return (Math.random() * Math.floor(9999999999999999))
}

if (process.argv[2] || process.argv[3]) {

  const person = new Person({
    id: generateId(),
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log('lisätään henkilö ' + person.name + ' numeroon ' + person.number + ' luetteloon')
    })
} else {
  console.log('puhelinluettelo:')

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name + ' ' + person.number)
      })
      mongoose.connection.close()
    })
}
