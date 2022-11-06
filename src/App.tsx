import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth, db, database } from './utils/firebase'
import useStore from './utils/store';
import { collection, query, onSnapshot, doc } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { Contact } from './utils/types';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios'
import AdminDashboard from './pages/AdminDashboard';

const Home = lazy(() => import('./pages/Home'))
const Landing = lazy(() => import('./pages/Landing'))
const Main = lazy(() => import('./pages/Main'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Employees = lazy(() => import('./pages/Employees'))
const EmployeeEdit = lazy(() => import('./pages/EmployeeEdit'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Help = lazy(() => import('./pages/Help'))
const Departments = lazy(() => import('./pages/Departments'))
const Contacts = lazy(() => import('./pages/Contacts'))
const ContactEdit = lazy(() => import('./pages/ContactEdit'))
const Addresses = lazy(() => import('./pages/Addresses'))

axios.defaults.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://first-express-orm.herokuapp.com/api'

export default function App() {
	const setUser = useStore((state) => state.setUser)
	const user = useStore((state) => state.user)
	const setDepartments = useStore((state) => state.setDepartments)
	const setEmployees = useStore((state) => state.setEmployees)
	const setContacts = useStore((state) => state.setContacts)
	useEffect(() => {
		const unsubscribeAuth = auth.onAuthStateChanged(user => {
			setUser(user)
		})
		const unsubscribeDepartments = onSnapshot(doc(db, "lookups", process.env.REACT_APP_LANG === 'en' ? "s" : "d"), doc => {
			setDepartments(doc.data()?.values)
		})
		const q1 = query(collection(db, process.env.REACT_APP_LANG === 'en' ? "employees_e" : "employees"));
		const unsubscribeEmployees = onSnapshot(q1, (querySnapshot) => {
			const employees = querySnapshot.docs.map(doc => ({
				id: doc.id,
				name: doc.data().name,
				departmentId: doc.data().departmentId,
				job: doc.data().job,
				gender: doc.data().gender,
				salary: doc.data().salary,
				mobile: doc.data().mobile,
				email: doc.data().email,
				address: doc.data().address,
				image: doc.data().image,
				isActive: doc.data().isActive
			}))
			setEmployees(employees)
		})
		if (user) {
			// const q2 = query(collection(db, "contacts"));
			// const unsubscribeConstants = onSnapshot(q2, (querySnapshot) => {
			// 	const oldContacts = querySnapshot.docs.map(doc => ({
			// 		name: doc.data().name,
			// 		mobile: doc.data().mobile,
			// 		mobileSent: doc.data().mobileSent,
			// 		email: doc.data().email,
			// 		sendingDate: doc.data().sendingDate?.toDate() || null,
			// 	}))
			// 	setOldContacts(oldContacts)
			// })
				const dbRef = ref(database, 'contacts/');
				onValue(dbRef, snapshot => {
					let contacts: Contact[] = []
					snapshot.forEach(doc => {
						contacts.push({
							id: doc.key!,
							name: doc.val().name,
							type: doc.val().type,
							link: doc.val().link,
							sendingDate: doc.val().sendingDate,
							addresses: doc.val().addresses || [],
							status: doc.val().status,
							newAdvert: doc.val().newAdvert || false
						})
					})
					setContacts(contacts)
				})
				// , {
				// 	onlyOnce: true
				// });
				// const addresses = querySnapshot.docs.map(doc => {
				// 	if (doc.data().addresses){
				// 		return doc.data().addresses.map((a: any) => ({
				// 			value: a,
				// 			contactId: doc.id
				// 		}))
				// 	}
				// }).filter(e => e).flat()
				// setAddresses(addresses)
			// })
		}

		return () => {
			unsubscribeAuth()
			unsubscribeDepartments()
			unsubscribeEmployees()
			// unsubscribeConstants()
		}
	}, [user])
	return (
		<BrowserRouter>
			<Suspense fallback={<LinearProgress />}>
				<Routes>
					<Route path="/" element={process.env.REACT_APP_LANG === 'en' ? <Login /> : <Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/main" element={<Main />} >
						<Route index element={<Home />} />
						<Route path="employees" element={<Employees />} />
						<Route path="employee-edit/:id" element={<EmployeeEdit />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="calendar" element={<Calendar />} />
						<Route path="help" element={<Help />} />
						<Route path="departments" element={<Departments />} />
						<Route path="contacts" element={<Contacts />} />
						<Route path="contact-edit/:id" element={<ContactEdit />} />
						<Route path="addresses/:id" element={<Addresses />} />
						<Route path="admin-dashboard" element={<AdminDashboard />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
