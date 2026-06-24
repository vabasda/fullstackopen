import { useParams, Link } from 'react-router-dom'
import { Paper, Button } from '@mui/material'

const Blog = ({ blog: propBlog, blogs, handleLike, handleDelete, currentUser }) => {
  const { id } = useParams()

  const blog = propBlog || (blogs ? blogs.find(b => b.id === id) : null)

  if (!blog) {
    return null
  }
 


  const showDeleteButton = currentUser && blog.user?.username === currentUser.username

 
  if (propBlog) {
    return (
      <div >
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} by {blog.author}
        </Link>
      </div>
    )
  }

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
    <div >
      <h1 style={{color: '#000', margin: 0, fontSize: '2rem', fontWeight: 'normal' }}>
          {blog.title}
        </h1>
        
        <p style={{ color: '#666', margin: '5px 0 15px 0' }}>
          by {blog.author}
        </p>
        
        <div style={{ marginBottom: 10 }}>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </div>
        
        <p style={{ color: '#666', marginBottom: 20 }}>
          Added by {blog.user ? blog.user.name : 'Unknown User'}
        </p>
        
        
        <div style={{ display: 'flex', alignItems: 'center()', gap: '10px' }}>
          <span style={{ marginRight: 10 }}>
            <span>likes {blog.likes}</span>
          </span>
          
          {currentUser && (
            <Button 
              variant="outlined" 
              color="primary" 
              size="small" 
              onClick={() => handleLike(blog)}
            >
              like
            </Button>
          )}
          
          {showDeleteButton && (
            <Button 
              variant="outlined" 
              color="error" 
              size="small" 
              onClick={() => handleDelete(blog)}
            >
              remove
            </Button>
          )}
        </div>
      </div>
    </Paper>
  )
}

export default Blog