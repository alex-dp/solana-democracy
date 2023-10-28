import { create } from "zustand";

type Notif = {
  type?: string
  message: string
  description?: string
  txid?: string
}

interface NotificationStore {
  notif: Notif,
  notify: (newNotif: Notif) => void,
  remove: () => void,
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notif: null,
  notify: (newNotif: Notif) => {
    set({
      notif: { type: 'success', ...newNotif }  
    })
  },
  remove: () => {
    set({
      notif: null
    })
  },
}))

export default useNotificationStore