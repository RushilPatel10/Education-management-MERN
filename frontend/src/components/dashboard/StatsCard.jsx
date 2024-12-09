import { Paper, Typography, Box } from '@mui/material'

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <Box>
        <Typography color="textSecondary" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}.light`,
          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
    </Paper>
  )
}

export default StatsCard 