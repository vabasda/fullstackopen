import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return(
      <div>
  <form onSubmit={handleCreateBlog}>
    <div>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
    <div>
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
    <div>
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
    <Button variant="contained" color="primary" type="submit">
          create
        </Button>
  </form>
  </div>
)
}
export default BlogForm