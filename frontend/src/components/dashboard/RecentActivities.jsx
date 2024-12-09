import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material'
import {
  Assignment,
  School,
  Person,
  Grade
} from '@mui/icons-material'
import { format } from 'date-fns'

const getActivityIcon = (type) => {
  switch (type) {
    case 'assignment':
      return <Assignment color="primary" />
    case 'course':
      return <School color="success" />
    case 'user':
      return <Person color="info" />
    case 'grade':
      return <Grade color="warning" />
    default:
      return null
  }
}

const RecentActivities = ({ activities }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Activities
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <ListItem>
              <ListItemIcon>
                {getActivityIcon(activity.type)}
              </ListItemIcon>
              <ListItemText
                primary={activity.description}
                secondary={format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </div>
        ))}
        {activities.length === 0 && (
          <ListItem>
            <ListItemText primary="No recent activities" />
          </ListItem>
        )}
      </List>
    </Paper>
  )
}

export default RecentActivities 