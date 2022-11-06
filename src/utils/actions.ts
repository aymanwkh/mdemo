import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { db, auth, database } from './firebase'
import { Address, Contact, Employee } from "./types";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";

export const signIn = async (username: string, password: string) => {
  const auth = getAuth()
  await signInWithEmailAndPassword(auth, username + '@gmail.com', password)
}

export const signOut = () => auth.signOut()

export const editEmployee = async (employee: Employee) => {
  const { id, ...others } = employee
  if (id) {
    const employeeRef = doc(db, process.env.REACT_APP_LANG === 'en' ? "employees_e" : "employees", id)
    await updateDoc(employeeRef, {...others})
  } else {
    await addDoc(collection(db, process.env.REACT_APP_LANG === 'en' ? "employees_e" : "employees"), {...others})
  }
}

export const editContact = (contact: Contact) => {
  const { id, ...others } = contact
  return set(ref(database, 'contacts/' + id), {...others})
  // const contactRef = doc(db, "contacts", id)
  // await setDoc(contactRef, {...others}, {merge: true})
}

export const deleteAddress = async (value: string, addresses: Address[], contacts: Contact[]) => {
  const address = addresses.find(a => a.value === value)
  if (!address) return
  const contact = contacts.find(c => c.id === address.contactId)
  if (!contact) return
  const i = contact.addresses.findIndex(a => a.value === value)
  contact.addresses.splice(i, 1)
  const { id, ...others } = contact
  await set(ref(database, 'contacts/' + id), {...others})
  // updateDoc(contactRef, { addresses: contactAddresses })
}

export const saveToken = (token: string) => {
  const tokenParts = token.split('.')
  let payload = 'c' + tokenParts[1] + 'o'
  localStorage.setItem('token', `${tokenParts[0]}.${payload}.${tokenParts[2]}`)
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (token){
    const tokenParts = token.split('.')
    let payload = tokenParts[1].substring(1, tokenParts[1].length - 1)
    return `${tokenParts[0]}.${payload}.${tokenParts[2]}`
  } else return ''
}