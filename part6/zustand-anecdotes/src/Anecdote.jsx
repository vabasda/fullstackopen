import { useAnecdoteActions } from './store' 
import { useNotificationActions } from './notificationStore'

const Anecdote = ({ anecdote }) => {
  const { vote,deleteAnecdote } = useAnecdoteActions() 
  const { setNotification, clearNotification } = useNotificationActions() 

  const handleVote = async () => {
    await vote(anecdote.id)
    setNotification(`You voted '${anecdote.content}'`)
    setTimeout(() => {
      clearNotification()
    }, 5000)
  }

  const handleDelete = async () => {
    await deleteAnecdote(anecdote.id)
    setNotification(`Deleted '${anecdote.content}'`)
    setTimeout(() => clearNotification(), 5000)
  }

  return (
    <li>
     <div> {anecdote.content}</div>
        has {anecdote.votes} votes {' '}
        <button onClick={handleVote}>vote</button>
        {anecdote.votes === 0 && (
          <button 
            onClick={handleDelete} >
            delete
          </button>
        )}
    </li>
  )
}

export default Anecdote