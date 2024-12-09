import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Collapse
} from '@mui/material'
import {
  Dashboard,
  School,
  People,
  Person,
  Assignment,
  Book,
  ExpandLess,
  ExpandMore,
  Settings,
  Assessment
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const [coursesOpen, setCoursesOpen] = useState(false)

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    {
      text: 'Courses',
      icon: <School />,
      subitems: [
        { text: 'All Courses', path: '/courses' },
        { text: 'My Courses', path: '/my-courses' },
        { text: 'Course Calendar', path: '/course-calendar' },
        ...(user?.role === 'admin' ? [{ text: 'Manage Courses', path: '/manage-courses' }] : [])
      ]
    },
    { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
    { text: 'Grades', icon: <Assessment />, path: '/grades' }
  ]

  if (user?.role === 'admin') {
    menuItems.push(
      { text: 'Students', icon: <People />, path: '/students' },
      { text: 'Teachers', icon: <Person />, path: '/teachers' },
      { text: 'Settings', icon: <Settings />, path: '/settings' }
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
          height: 'calc(100% - 64px)',
          backgroundColor: (theme) => theme.palette.background.default,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <Box key={item.text}>
              {item.subitems ? (
                <>
                  <ListItemButton
                    onClick={() => setCoursesOpen(!coursesOpen)}
                    selected={location.pathname.startsWith(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {coursesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={coursesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subitems.map((subitem) => (
                        <ListItemButton
                          key={subitem.text}
                          sx={{ pl: 4 }}
                          onClick={() => handleNavigation(subitem.path)}
                          selected={location.pathname === subitem.path}
                        >
                          <ListItemText primary={subitem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar 