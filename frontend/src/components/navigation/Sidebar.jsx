import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box
} from '@mui/material'
import {
  Dashboard,
  School,
  People,
  Person,
  Assignment
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = ({ open }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Courses', icon: <School />, path: '/courses' },
  ]

  if (user?.role === 'admin') {
    menuItems.push(
      { text: 'Teachers', icon: <People />, path: '/teachers' },
      { text: 'Students', icon: <People />, path: '/students' }
    )
  }

  if (user?.role === 'teacher') {
    menuItems.push(
      { text: 'Assignments', icon: <Assignment />, path: '/assignments' }
    )
  }

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          mt: '64px'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  )
}

export default Sidebar 