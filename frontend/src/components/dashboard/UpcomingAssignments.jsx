import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import { Assignment, Edit, Delete } from '@mui/icons-material'
import { format } from 'date-fns'

const UpcomingAssignments = ({ assignments, onEdit, onDelete }) => {
  const getStatusColor = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    if (now > due) return 'error'
    if (now.getTime() + 86400000 > due.getTime()) return 'warning'
    return 'success'
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Assignments
      </Typography>
      <List>
        {assignments.map((assignment) => (
          <ListItem key={assignment.id} divider>
            <ListItemText
              primary={assignment.title}
              secondary={`${assignment.course.name} - Due: ${format(
                new Date(assignment.dueDate),
                'MMM dd, yyyy'
              )}`}
            />
            <ListItemSecondaryAction>
              <Chip
                label={format(new Date(assignment.dueDate), 'MMM dd')}
                color={getStatusColor(assignment.dueDate)}
                size="small"
                sx={{ mr: 1 }}
              />
              {onEdit && (
                <Tooltip title="Edit">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => onEdit(assignment)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(assignment)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {assignments.length === 0 && (
          <ListItem>
            <ListItemText primary="No upcoming assignments" />
          </ListItem>
        )}
      </List>
    </Paper>
  )
}

export default UpcomingAssignments 