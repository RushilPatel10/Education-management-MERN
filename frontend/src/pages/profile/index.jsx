import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { setCredentials } from '../../redux/slices/authSlice'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        return toast.error('New passwords do not match')
      }

      const response = await api.put('/users/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })

      dispatch(setCredentials({ 
        user: response.data.user,
        token: response.data.token 
      }))
      toast.success('Profile updated successfully')
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography color="textSecondary">{user?.role}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Change Password
              </Typography>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                margin="normal"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                margin="normal"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                margin="normal"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
              >
                Update Profile
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Profile 