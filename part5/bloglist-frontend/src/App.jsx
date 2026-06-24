import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './components/Home'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm' 
import blogService from './services/blogs'
import loginService from './services/login'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const padding = { padding: 5 }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/blogs')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/blogs')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      const completedBlog = {
        ...newBlog,
        user: { username: user.username, name: user.name }
      }
      setBlogs(blogs.concat(completedBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
      
      navigate('/blogs')
    } catch (exception) {
      console.error('Failed to create blog', exception)
    }
  }

  const handleLike = async (blogToLike) => {
    if (!user) return

    const updatedBlog = {
      user: blogToLike.user?.id || blogToLike.user,
      likes: blogToLike.likes + 1,
      author: blogToLike.author,
      title: blogToLike.title,
      url: blogToLike.url
    }
    try {
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)
      setBlogs(blogs.map(b => b.id !== blogToLike.id ? b : { ...returnedBlog, user: blogToLike.user }))
    } catch (exception) {
      console.error('Failed to update likes', exception)
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {
    const confirmation = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
    if (confirmation) {
      await blogService.remove(blogToDelete.id)
      setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
      
      navigate('/blogs') 
    }
  }

return (
  <div>
  <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          
          <Button color="inherit" component={Link} to="/blogs">
            blogs
          </Button>
          
          {user && (
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>
          )}
          
          {!user && (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
          
          {user && (
            <>
              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/blogs" element={
          <BlogList blogs={blogs} successMessage={successMessage} />
        } />
        
        <Route path="/blogs/:id" element={
          <Blog 
            blogs={blogs} 
            handleLike={handleLike} 
            handleDelete={handleDeleteBlog} 
            currentUser={user} 
          />
        } />

        <Route path="/create" element={
          <div>
            <BlogForm createBlog={handleCreateBlog} />
          </div>
        } />

        <Route path="/login" element={
          <LoginForm 
            handleLogin={handleLogin} 
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            errorMessage={errorMessage}
          />
        } />
        
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App