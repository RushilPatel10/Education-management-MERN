import { useState } from 'react'
import { Box, CssBaseline } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Sidebar from '../components/navigation/Sidebar'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.grey[100]
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout 