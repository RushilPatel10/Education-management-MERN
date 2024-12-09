import { Paper, List, ListItem, ListItemText, Typography, Divider } from '@mui/material'

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
              <ListItemText
                primary={activity.description}
                secondary={new Date(activity.timestamp).toLocaleDateString()}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  )
}

export default RecentActivities 