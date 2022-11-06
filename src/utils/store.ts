import create from 'zustand'
import firebase from 'firebase/auth'
import { Contact, Department, Employee, Snackbar } from './types'

interface Store {
  user: firebase.User | null,
  userId: string | null,
  openDrawer: boolean | undefined,
  departments: Department[],
  employees: Employee[],
  contacts: Contact[],
  snackbar: Snackbar,
  setUser: (payload: firebase.User | null) => void,
  setUserId: (payload: string | null) => void,
  toggleDrawer: () => void,
  setDepartments: (payload: Department[]) => void,
  setEmployees: (payload: Employee[]) => void,
  setContacts: (payload: Contact[]) => void,
  success: (payload: string) => void,
  error: (payload: string) => void,
  closeSnackbar: () => void
}
const useStore = create<Store>((set) => ({
  user: null,
  userId: null,
  openDrawer: false,
  departments: [],
  employees: [],
  contacts: [],
  snackbar: {} as Snackbar,
  setUser: (payload: firebase.User | null) => set(() => ({user: payload})),
  setUserId: (payload: string | null) => set(() => ({userId: payload})),
  toggleDrawer: () => set((state) => ({openDrawer: !state.openDrawer})),
  setDepartments: (payload: Department[]) => set(() => ({departments: payload})),
  setEmployees: (payload: Employee[]) => set(() => ({employees: payload})),
  setContacts: (payload: Contact[]) => set(() => ({contacts: payload})),
  success: (payload: string) => set(() => ({snackbar: {
    severity: "success",
    message: payload,
    isOpen: true
  }})),
  error: (payload: string) => set(() => ({snackbar: {
    severity: "error",
    message: payload,
    isOpen: true
  }})),
  closeSnackbar: () => set(() => ({snackbar: {} as Snackbar}))
}))

export default useStore