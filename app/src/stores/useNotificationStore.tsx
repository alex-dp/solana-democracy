import { create } from "zustand";

interface NotificationStore {
  notifications: Array<{
    type: string
    message: string
    description?: string
    txid?: string
  }>,
  notify: (newNotif: {
    type?: string
    message: string
    description?: string
    txid?: string
  }) => void,
  remove: (idx: number) => void
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  notify: (newNotif: {
    type?: string
    message: string
    description?: string
    txid?: string
  }) => {
    set({
      notifications: [
        ...get().notifications,
        { type: 'success', ...newNotif },
      ]
    })
  },
  remove: (idx) => {
    const reversedIndex = get().notifications.length - 1 - idx
    set({
      notifications: [
        ...get().notifications.slice(0, reversedIndex),
        ...get().notifications.slice(reversedIndex + 1),
      ]
    })
  }
}))

export default useNotificationStore