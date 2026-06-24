import { Link } from 'react-router-dom'
import Notification from './Notification'

const BlogList = ({ blogs, successMessage }) => {
  const blogsCopy = [...blogs]
  blogsCopy.sort((a, b) => b.likes - a.likes)


return (
  <div>
    <h2>blogs</h2>
    <Notification message={successMessage} type="success" />

    <div >
      {blogsCopy.map(blog => (
        <div key={blog.id}  className="blog-item">
          <Link to={'/blogs/' + blog.id}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  </div>
)
}

export default BlogList