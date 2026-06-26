import { useMutation, useQueryClient, } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useContext } from 'react' 
import useNotify from '../hooks/useNotify'

const AnecdoteForm = () => {

   const queryClient = useQueryClient()

  const { showNotification } = useNotify()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const notes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], notes.concat(newAnecdote))
      showNotification(`anecdote '${newAnecdote.content}' created`)
    },
    onError: (error) => {
      showNotification('too short anecdote, must have length 5 or more')
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm