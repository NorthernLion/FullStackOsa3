const mongoose = require('mongoose')

const url = 'mongodb://jasperli:1@ds039058.mlab.com:39058/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  id: String,
  name: String,
  number: String
})

Person.format = function (person) {
  return {
    id: person.id,
    name: person.name,
    number: person.number
  }
}

module.exports = Person
