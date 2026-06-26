// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, render, screen, cleanup, fireEvent } from '@testing-library/react' // 🟢 Προσθήκη fireEvent
import React from 'react'
import AnecdoteList from './AnecdoteList'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

describe('Anecdote App Tests', () => {
  beforeEach(() => {
    cleanup()
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  test('verifies the state is initialized with the anecdotes returned by the backend', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'If it hurts, do it more often', votes: 3 },
      { id: 2, content: 'Premature optimization is the root of all evil', votes: 0 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result: actionsResult } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await actionsResult.current.initialize()
    })
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  test('verifies the component displaying anecdotes receives them sorted by votes', () => {
    const mockAnecdotes = [
      { id: 1, content: 'Anecdote with the least votes', votes: 2 },
      { id: 2, content: 'Anecdote with the most votes', votes: 10 },
      { id: 3, content: 'Anecdote with no votes', votes: 0 }
    ]
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: '' })

    render(React.createElement(AnecdoteList))
    const items = screen.getAllByRole('listitem')

    expect(items[0].textContent).toContain('Anecdote with the most votes')
    expect(items[1].textContent).toContain('Anecdote with the least votes')
    expect(items[2].textContent).toContain('Anecdote with no votes')
  })

  test('verifies that voting increases the number of votes for an anecdote', async () => {
    const mockAnecdote = { id: 1, content: 'Humor is essential', votes: 5 }
    useAnecdoteStore.setState({ anecdotes: [mockAnecdote], filter: '' })

    anecdoteService.update.mockResolvedValue({ ...mockAnecdote, votes: 6 })
    render(React.createElement(AnecdoteList))
    const voteButton = screen.getByRole('button', { name: /vote/i })
    
    await act(async () => {
      fireEvent.click(voteButton)
    })

    expect(screen.getByText(/has 6 votes/i)).toBeDefined()
    
    expect(anecdoteService.update).toHaveBeenCalledWith(1, { ...mockAnecdote, votes: 6 })
  })


    test('verifies the component receives a properly filtered list of anecdotes', () => {

      const mockAnecdotes = [
      { id: 1, content: 'React hooks are great', votes: 0 },
      { id: 2, content: 'Zustand simplifies state', votes: 0 },
      { id: 3, content: 'Testing library is useful', votes: 0 }
    ]
      useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: 'Zustand' })

      render(React.createElement(AnecdoteList))
      const items = screen.getAllByRole('listitem')

      expect(items).toHaveLength(1)
      expect(items[0].textContent).toContain('Zustand simplifies state')
      expect(items[0].textContent).not.toContain('React hooks are great')
    })
  })
