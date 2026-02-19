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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import branchService from '../../services/branchService';

const BranchSettings = ({ branchId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    academic_year: '',
    timezone: 'UTC',
    currency: 'USD',
    date_format: 'Y-m-d',
    time_format: 'H:i:s',
    max_students_per_class: '30',
    enable_online_payment: 'false',
    enable_sms_notifications: 'false',
  });
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    if (branchId) {
      fetchSettings();
    }
  }, [branchId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await branchService.getBranchSettings(branchId);
      setSettings({ ...settings, ...response.data });
    } catch (error) {
      showAlert('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await branchService.updateBranchSettings(branchId, settings);
      showAlert('success', 'Settings saved successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Branch Settings
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Academic Year */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={settings.academic_year}
                onChange={(e) => handleChange('academic_year', e.target.value)}
                placeholder="2024-2025"
              />
            </Grid>

            {/* Timezone */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.timezone}
                  label="Timezone"
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">Eastern Time</MenuItem>
                  <MenuItem value="America/Chicago">Central Time</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                  <MenuItem value="Europe/London">London</MenuItem>
                  <MenuItem value="Asia/Dubai">Dubai</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Currency"
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="AED">AED - UAE Dirham</MenuItem>
                  <MenuItem value="SAR">SAR - Saudi Riyal</MenuItem>
                  <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date Format */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.date_format}
                  label="Date Format"
                  onChange={(e) => handleChange('date_format', e.target.value)}
                >
                  <MenuItem value="Y-m-d">YYYY-MM-DD</MenuItem>
                  <MenuItem value="d/m/Y">DD/MM/YYYY</MenuItem>
                  <MenuItem value="m/d/Y">MM/DD/YYYY</MenuItem>
                  <MenuItem value="d-m-Y">DD-MM-YYYY</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Time Format */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Time Format</InputLabel>
                <Select
                  value={settings.time_format}
                  label="Time Format"
                  onChange={(e) => handleChange('time_format', e.target.value)}
                >
                  <MenuItem value="H:i:s">24-hour (HH:MM:SS)</MenuItem>
                  <MenuItem value="h:i:s A">12-hour (hh:mm:ss AM/PM)</MenuItem>
                  <MenuItem value="H:i">24-hour (HH:MM)</MenuItem>
                  <MenuItem value="h:i A">12-hour (hh:mm AM/PM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Max Students Per Class */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Students Per Class"
                value={settings.max_students_per_class}
                onChange={(e) => handleChange('max_students_per_class', e.target.value)}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>

            {/* Enable Online Payment */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enable_online_payment === 'true'}
                    onChange={(e) =>
                      handleChange('enable_online_payment', e.target.checked ? 'true' : 'false')
                    }
                  />
                }
                label="Enable Online Payment"
              />
            </Grid>

            {/* Enable SMS Notifications */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enable_sms_notifications === 'true'}
                    onChange={(e) =>
                      handleChange('enable_sms_notifications', e.target.checked ? 'true' : 'false')
                    }
                  />
                }
                label="Enable SMS Notifications"
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BranchSettings;
