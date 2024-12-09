import { Paper, Box, Typography } from '@mui/material'

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography color="text.secondary" variant="h6">
          {title}
        </Typography>
        {icon && (
          <Box sx={{ color }}>
            {icon}
          </Box>
        )}
      </Box>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </Paper>
  )
}

export default StatsCard 