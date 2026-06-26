import AnecdoteForm from './components/AnecdoteForm'
import useNotify from './hooks/useNotify'
import React, { useContext } from 'react'
import Notification from './components/Notification'

import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {

 const { anecdotes, isPending, isError, vote } = useAnecdotes()
 const { showNotification } = useNotify()

 if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const handleVote = (anecdote) => {
    vote({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    showNotification(`anecdote '${anecdote.content}' voted`)
  }
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App