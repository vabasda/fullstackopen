import Notification from './Notification'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ 
  handleLogin, 
  username, 
  password, 
  setUsername, 
  setPassword, 
  errorMessage 
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} type="error"/>
      
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            variant="standard"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            variant="standard"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
       <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm