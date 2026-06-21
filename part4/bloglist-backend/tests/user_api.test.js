const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const User = require('../models/user') 

const api = supertest(app) 

beforeEach(async () => {
    await User.deleteMany({})
    const testUser = new User({ username: 'root', passwordHash: 'secret' })
    await testUser.save()
})

test('creation fails with 400 BR if password is less than 3 characters', async () => {
    const newUser = {
        username: 'vabasda',
        name: 'Vagg',
        password: '12' 
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(result.body.error, 'password is required and must be at least 3 characters')
})

test('creation fails with 400 BR if username is too short', async () => {
    const newUser = {
        username: 'va', 
        name: 'Vagg',
        password: '123456'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
})

test('creation fails with 400 BR if username is not unique', async () => {
    const newUser = {
        username: 'root',
        passwordHash: '123456'
    }

    await api.post('/api/users').send(newUser).expect(400)
})

after(async () => {
  await mongoose.connection.close()
})