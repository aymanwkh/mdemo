import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import useStore from '../utils/store'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from '../components/Logo'
import LogoutIcon from '@mui/icons-material/Logout'
import { signOut } from '../utils/actions'
import FaceIcon from '@mui/icons-material/Face'
import { useMemo } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import EmailIcon from '@mui/icons-material/Email'
import labels_a from '../utils/labels.json'
import labels_e from '../utils/labels_e.json'
import GlobalStyles from '@mui/material/GlobalStyles';


const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a
const drawerWidth = 240
const menuItems_a = [
  {
    icon: HomeIcon,
    label: labels.home,
    path: "/main",
    type: "p"
  },
  {
    icon: BarChartIcon,
    label: labels.dashboard,
    path: "/main/dashboard",
    type: "p"
  },
  {
    icon: AccountTreeIcon,
    label: labels.departments, 
    path: "/main/departments",
    type: "p"
  },
  {
    icon: PeopleIcon,
    label: labels.employees,
    path: "/main/employees",
    type: "p"
  },
  {
    icon: EventIcon,
    label: labels.calendar,
    path: "/main/calendar",
    type: "p"
  },
  {
    icon: HelpCenterIcon,
    label: labels.help,
    path: "/main/help",
    type: "p"
  },
  {
    icon: FaceIcon,
    label: labels.contacts,
    path: "/main/contacts",
    type: "s"
  },
  {
    icon: EmailIcon,
    label: labels.addresses,
    path: "/main/addresses/0",
    type: "s"
  },
  {
    icon: BarChartIcon,
    label: labels.dashboard,
    path: "/main/admin-dashboard",
    type: "s"
  },
]

const menuItems_e = [
  {
    icon: HomeIcon,
    label: labels.home,
    path: "/main/dashboard",
    type: "p"
  },
  {
    icon: PeopleIcon,
    label: labels.employees,
    path: "/main/employees",
    type: "p"
  },
  {
    icon: HelpCenterIcon,
    label: labels.help,
    path: "/main/help",
    type: "p"
  },
]

const menuItems = process.env.REACT_APP_LANG === 'en' ? menuItems_e : menuItems_a

export default function Main() {
  const location = useLocation()
  const user = useStore((state) => state.user)
  const toggleDrawer = useStore((state) => state.toggleDrawer)
  const openDrawer = useStore((state) => state.openDrawer)
  const snackbar = useStore((state) => state.snackbar)
  const closeSnackbar = useStore((state) => state.closeSnackbar)
  const menu = useMemo(() => menuItems.filter(i => user || i.type === 'p'), [user])
  const drawer = (
    <div>
      <Logo sx={{ p: 4 }} />
      <List>
        {menu.map((e, i) => (
          <ListItem key={e.path} disablePadding>
            <ListItemButton 
              component={NavLink} 
              to={e.path} 
              selected={location.pathname === e.path}
              onClick={toggleDrawer}
            >
              <ListItemIcon>
                <e.icon />
              </ListItemIcon>
              <ListItemText primary={e.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && 
          <ListItemButton 
            onClick={signOut}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={labels.logout} />
          </ListItemButton>      
        }
      </List>
    </div>
  )
  if (process.env.REACT_APP_LANG === 'en' && !user) {
    return <Navigate to="/login" />
  }
  return (
    <>
      <GlobalStyles styles={{ main: { backgroundColor: '#f0f0f0' } }} />
      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            BackdropProps={{ invisible: true }}
            open={openDrawer}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', lg: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', lg: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 2, width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` }, height: '100vh', overflow: 'auto'}}
        >
          <Outlet />
        </Box>
      </Box>
      <Snackbar
        key={snackbar.message}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={snackbar.isOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert variant="filled" onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
