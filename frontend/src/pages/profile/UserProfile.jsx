import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Avatar,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import authService from '../../services/authService';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [activities, setActivities] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (tabValue === 2) {
      loadActivityLog();
    }
  }, [tabValue]);

  const loadUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response.data;
      setUser(userData);
      setProfileData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
      });
    } catch (error) {
      showAlert('error', 'Failed to load user data');
    }
  };

  const loadActivityLog = async () => {
    try {
      const response = await authService.getActivityLog(20);
      setActivities(response.data.data || []);
    } catch (error) {
      console.error('Failed to load activity log:', error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await authService.updateProfile(profileData);
      showAlert('success', 'Profile updated successfully');
      loadUserData();
    } catch (error) {
      showAlert('error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.password !== passwordData.password_confirmation) {
      showAlert('error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(
        passwordData.current_password,
        passwordData.password,
        passwordData.password_confirmation
      );
      showAlert('success', 'Password changed successfully');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      login: '🔐',
      logout: '🚪',
      password_change: '🔑',
      password_reset: '🔄',
      profile_update: '✏️',
      failed_login: '❌',
    };
    return iconMap[type] || '📝';
  };

  return (
    <Box sx={{ p: 3 }}>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main', fontSize: 32 }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{user?.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email}
              </Typography>
              <Box mt={1}>
                {user?.roles?.map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    size="small"
                    color="primary"
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mt: 2 }}>
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<LockIcon />} label="Security" />
            <Tab icon={<HistoryIcon />} label="Activity Log" />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Branch"
                  value={user?.branch?.name || 'N/A'}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current_password: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, password: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.password_confirmation}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, password_confirmation: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Activity Log Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {activities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{getActivityIcon(activity.activity_type)}</span>
                        <Typography variant="body1">
                          {activity.description || activity.activity_type}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {new Date(activity.created_at).toLocaleString()}
                        </Typography>
                        {activity.ip_address && (
                          <Typography variant="caption" color="textSecondary">
                            IP: {activity.ip_address}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {activities.length === 0 && (
                <ListItem>
                  <ListItemText primary="No activity recorded yet" />
                </ListItem>
              )}
            </List>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
