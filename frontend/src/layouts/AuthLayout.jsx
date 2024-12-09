import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Outlet />
    </Box>
  )
}

export default AuthLayout 