const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { _id: '1', title: 'Blog 1', author: 'Greek', url: 'https://blog1.com/', likes: 7, __v: 0 },
    { _id: '2', title: 'Blog 2', author: 'Italian', url: 'https://blog2.com/', likes: 5, __v: 0 },
    { _id: '3', title: 'Blog 3', author: 'Turkish', url: 'https://blog3.com/', likes: 12, __v: 0 }
  ]

  test('finds the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    
    assert.deepStrictEqual(result, {
      title: 'Blog 3',
      author: 'Turkish',
      likes: 12
    })
  })

  
  test('when multiple blogs have the same max likes, returns one of them', () => {
    const blogsWithTie = [
    { _id: '1', title: 'Blog 1', author: 'Greek', url: 'https://blog1.com/', likes: 12, __v: 0 },
    { _id: '2', title: 'Blog 2', author: 'Italian', url: 'https://blog2.com/', likes: 5, __v: 0 },
    { _id: '3', title: 'Blog 3', author: 'Turkish', url: 'https://blog3.com/', likes: 12, __v: 0 }
    ]

    const result = listHelper.favoriteBlog(blogsWithTie)

    assert.deepStrictEqual(result, {
      title: 'Blog 3',
      author: 'Turkish',
      likes: 12
    })
  })

  test('when blogs list is empty', () => {
    const blogsEmpty = []

    const result = listHelper.favoriteBlog(blogsEmpty)

    assert.deepStrictEqual(result, null)
  })
})

