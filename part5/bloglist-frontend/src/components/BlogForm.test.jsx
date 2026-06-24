import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('form calls the event handler with the right details when a new blog is created', async () => {

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockHandler} />)

  
  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')
  
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing')
  await user.type(authorInput, 'Tester')
  await user.type(urlInput, 'https://test.com')

  await user.click(sendButton)

  expect(mockHandler.mock.calls).toHaveLength(1)

 
  const submittedData = mockHandler.mock.calls[0][0]
  
  expect(submittedData.title).toBe('Testing')
  expect(submittedData.author).toBe('Tester')
  expect(submittedData.url).toBe('https://test.com')
})