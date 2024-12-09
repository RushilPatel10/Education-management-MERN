import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material'
import { Save, Refresh } from '@mui/icons-material'
import api from '../../services/api'

const Settings = () => {
  const [tabValue, setTabValue] = useState(0)
  const [settings, setSettings] = useState({
    allowRegistration: true,
    maxStudentsPerCourse: 30,
    allowMultipleCourseEnrollment: true,
    emailNotifications: true,
    maintenanceMode: false,
    gradingSystem: 'percentage', // or 'letter'
    academicYear: '2023-2024'
  })

  const [emailTemplates, setEmailTemplates] = useState({
    welcome: '',
    courseEnrollment: '',
    assignmentReminder: '',
    gradePosted: ''
  })

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleTemplateChange = (template, value) => {
    setEmailTemplates(prev => ({
      ...prev,
      [template]: value
    }))
  }

  const saveSettings = async () => {
    try {
      await api.put('/settings', settings)
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Error saving settings:', error)
    }
  }

  const saveEmailTemplates = async () => {
    try {
      await api.put('/settings/email-templates', emailTemplates)
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Error saving email templates:', error)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="General Settings" />
          <Tab label="Email Templates" />
          <Tab label="System Maintenance" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Changes to these settings will affect the entire system.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Allow Registration"
                      secondary="Enable/disable new user registration"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowRegistration}
                        onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Multiple Course Enrollment"
                      secondary="Allow students to enroll in multiple courses"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.allowMultipleCourseEnrollment}
                        onChange={(e) => handleSettingChange('allowMultipleCourseEnrollment', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText 
                      primary="Email Notifications"
                      secondary="Enable system-wide email notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Students per Course"
                  type="number"
                  value={settings.maxStudentsPerCourse}
                  onChange={(e) => handleSettingChange('maxStudentsPerCourse', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Academic Year"
                  value={settings.academicYear}
                  onChange={(e) => handleSettingChange('academicYear', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  select
                  label="Grading System"
                  value={settings.gradingSystem}
                  onChange={(e) => handleSettingChange('gradingSystem', e.target.value)}
                  margin="normal"
                >
                  <option value="percentage">Percentage</option>
                  <option value="letter">Letter Grade</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveSettings}
                  sx={{ mr: 2 }}
                >
                  Save Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {/* Reset to defaults */}}
                >
                  Reset to Defaults
                </Button>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Customize email templates using available placeholders: {'{name}'}, {'{course}'}, etc.
                </Alert>
              </Grid>
              
              {Object.entries(emailTemplates).map(([key, value]) => (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    multiline
                    rows={4}
                    value={value}
                    onChange={(e) => handleTemplateChange(key, e.target.value)}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={saveEmailTemplates}
                >
                  Save Templates
                </Button>
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Enabling maintenance mode will make the system inaccessible to regular users.
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Enable Maintenance Mode"
                />
              </Grid>

              {/* Add more maintenance options here */}
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Settings 