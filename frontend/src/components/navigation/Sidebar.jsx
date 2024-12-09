import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Dashboard,
  School,
  People,
  Person,
  Assignment
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Courses', icon: <School />, path: '/courses' }
  ]

  if (user?.role === 'admin') {
    menuItems.push(
      { text: 'Students', icon: <People />, path: '/students' },
      { text: 'Teachers', icon: <Person />, path: '/teachers' }
    )
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100% - 64px)'
        }
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar 