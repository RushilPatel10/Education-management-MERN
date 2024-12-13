import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/admin/courses' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  ];

  const teacherMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher/dashboard' },
    { text: 'My Courses', icon: <SchoolIcon />, path: '/teacher/courses' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/teacher/assignments' },
  ];

  const studentMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
    { text: 'My Courses', icon: <SchoolIcon />, path: '/student/courses' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/student/assignments' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'teacher':
        return teacherMenuItems;
      case 'student':
        return studentMenuItems;
      default:
        return [];
    }
  };

  return (
    <Box sx={{ mt: 8 }}>
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        <ListItem button>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar; 