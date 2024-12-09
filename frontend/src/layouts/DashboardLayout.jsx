import { useState } from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Sidebar from '../components/navigation/Sidebar'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar open={isSidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: isSidebarOpen ? '240px' : 0,
          transition: 'margin 0.2s'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout 