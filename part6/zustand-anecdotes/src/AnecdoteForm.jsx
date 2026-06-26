import { useAnecdoteActions } from './store'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    await add(content) 
    e.target.reset()
  }

  return (
    
    <form onSubmit={addAnecdote}>
      <h1>create new</h1> 
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
