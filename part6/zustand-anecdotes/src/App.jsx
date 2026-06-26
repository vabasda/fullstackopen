import AnecdoteList from './AnecdoteList'
import AnecdoteForm from './AnecdoteForm'
import anecdoteService from './services/anecdotes'
import Filter from './Filter'
import { useAnecdoteActions } from './store'
import { useEffect } from 'react'
import Notification from './components/Notification'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])
  
  return (
    <div>
      <h1>Anecdotes</h1>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App