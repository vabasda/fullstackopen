import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'test-blog-id' }),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}))

test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {

  const blog = {
    id: 'test-blog-id',
    title: 'Component tested',
    author: 'Vagg Basda',
    url: 'https://test.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blogs={[blog]} currentUser={null} />)

  expect(screen.getByText('Component tested')).toBeDefined()
  expect(screen.getByText('https://test.com/')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
  const blog = {
    id: 'test-blog-id',
    title: 'Component tested',
    author: 'Vagg Basda',
    url: 'https://test.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const nonCreator = {
    username: 'anotheruser',
    name: 'Someone Else'
  }
  render(<Blog blogs={[blog]} currentUser={nonCreator} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('The blog’s creator is also shown the delete button and clicking like twice calls handler twice', async () => {
  const blog = {
    id: 'test-blog-id',
    title: 'Component tested',
    author: 'Vagg Basda',
    url: 'https://test.com/',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const creator = {
    username: 'testuser',
    name: 'Test User'
  }

  const mockHandler = vi.fn()

  render(<Blog blogs={[blog]} currentUser={creator} handleLike={mockHandler} />)

  const likeButton = screen.getByText('like')
  const removeButton = screen.getByText('remove')
  expect(likeButton).toBeDefined()
  expect(removeButton).toBeDefined()

  const user = userEvent.setup()
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})