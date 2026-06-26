import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setNotification: (message) => set(() => ({ message })),
    clearNotification: () => set(() => ({ message: null }))
  }
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)