const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.use(express.static('dist'))
const Phonebook = require('./models/phonebook')


morgan.token('body', function (request) {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response, next) => {
  Phonebook.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  /*const nameExists = (name) => {
    return persons.find(person => person.name === name)
  }

  if(nameExists(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/

  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phonebook.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(unknownEndpoint)
app.use(errorHandler)




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})