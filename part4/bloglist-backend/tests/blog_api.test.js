const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const Blog = require('../models/blog') 
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app) 

const initialBlogs = [
  {
    title: 'Blog1',
    author: 'Author1',
    url: 'https://blog1.com/',
    likes: 7
  },
  {
    title: 'Blog2',
    author: 'Author2',
    url: 'https://blog2.com/',
    likes: 5
  }
]

let token = null

beforeEach(async () => {
  await Blog.deleteMany({}) 
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testPassword', 10)
  const user = new User({ username: 'testUser', passwordHash })
  await user.save()
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testUser', password: 'testPassword' })
  token = loginResponse.body.token  

  const blogObject1 = new Blog({ ...initialBlogs[0], user: user._id })
  await blogObject1.save()
  const blogObject2 = new Blog({ ...initialBlogs[1], user: user._id })
  await blogObject2.save()
})

test('blogs are returned as json and the amount is correct', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200) 
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
    
})

test('blogs id is correctly defined as id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body[0]
  assert.notStrictEqual(blogs.id, undefined)
  assert.strictEqual(blogs._id, undefined)
})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Blog3',
    author: 'Author3',
    url: 'https://blog3.com/',
    likes: 12
  }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Blog3'))
})

test('deletion of a blog', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0] 
    
  await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('updating a blog', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updatedBlog = {
    title: 'Updated Blog',
    author: 'Updated Author',
    url: 'https://updated-blog.com/',
    likes: 15
  }

  const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200).expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, updatedBlog.likes)
})

test('0 likes for a blog missing the likes property ', async () => {
  
  const newBlog ={
    title: 'Blog with 0 likes',
    author: 'Vagg',
    url: 'www.nolikes.com'
  }

  const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title returns 400 BR', async () => {
  const blogWithoutTitle = {
    author: 'Vagg',
    url: 'www.notitle.com',
    likes: 5
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutTitle).expect(400)
})

test('blog without url returns 400 BR', async () => {
  const blogWithoutUrl = {
    title: 'A blog without URL',
    author: 'Vagg',
    likes: 5
  }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutUrl).expect(400)
})


after(async () => {
  await mongoose.connection.close()
})