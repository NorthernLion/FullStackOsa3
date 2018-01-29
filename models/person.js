const mongoose = require('mongoose')

const url = 'mongodb://admin:test@ds039058.mlab.com:39058/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

Person.format = function (person) {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

module.exports = Person
