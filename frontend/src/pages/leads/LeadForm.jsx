import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { createLead, updateLead, fetchLead, clearCurrentLead } from '../../store/slices/leadSlice';
import { validateLeadForm } from '../../utils/validation';
import { handleApiError, getValidationErrors, mergeErrors } from '../../utils/errorHandler';
import { scrollToAndHighlightErrors, clearErrorHighlights, countErrors } from '../../utils/formHelpers';
import Notification from '../../components/common/Notification';

const LeadForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLead, loading } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    branch_id: user?.branch_id || '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    grade_applying_for: '',
    previous_school: '',
    academic_year: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_occupation: '',
    relationship: 'parent',
    source: '',
    referral_name: '',
    status: 'new',
    priority: 'medium',
    next_follow_up_date: '',
    notes: '',
    assigned_to: '',
    estimated_fee: '',
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchLead(id));
    }
    return () => {
      dispatch(clearCurrentLead());
    };
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && currentLead) {
      setFormData({
        branch_id: currentLead.branch_id || '',
        first_name: currentLead.first_name || '',
        last_name: currentLead.last_name || '',
        email: currentLead.email || '',
        phone: currentLead.phone || '',
        alternate_phone: currentLead.alternate_phone || '',
        date_of_birth: currentLead.date_of_birth || '',
        gender: currentLead.gender || '',
        address: currentLead.address || '',
        city: currentLead.city || '',
        state: currentLead.state || '',
        postal_code: currentLead.postal_code || '',
        country: currentLead.country || 'Pakistan',
        grade_applying_for: currentLead.grade_applying_for || '',
        previous_school: currentLead.previous_school || '',
        academic_year: currentLead.academic_year || '',
        parent_name: currentLead.parent_name || '',
        parent_phone: currentLead.parent_phone || '',
        parent_email: currentLead.parent_email || '',
        parent_occupation: currentLead.parent_occupation || '',
        relationship: currentLead.relationship || 'parent',
        source: currentLead.source || '',
        referral_name: currentLead.referral_name || '',
        status: currentLead.status || 'new',
        priority: currentLead.priority || 'medium',
        next_follow_up_date: currentLead.next_follow_up_date || '',
        notes: currentLead.notes || '',
        assigned_to: currentLead.assigned_to || '',
        estimated_fee: currentLead.estimated_fee || '',
      });
    }
  }, [currentLead, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const validationErrors = validateLeadForm(formData);
    setErrors(validationErrors);
    
    // Highlight errors and scroll to first error
    if (Object.keys(validationErrors).length > 0) {
      scrollToAndHighlightErrors(validationErrors);
    } else {
      clearErrorHighlights();
    }
    
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!validate()) {
      const errorCount = countErrors(errors);
      setNotification({
        open: true,
        message: `Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting`,
        severity: 'warning',
      });
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updateLead({ id, data: formData })).unwrap();
        setNotification({
          open: true,
          message: 'Lead updated successfully!',
          severity: 'success',
        });
      } else {
        await dispatch(createLead(formData)).unwrap();
        setNotification({
          open: true,
          message: 'Lead created successfully!',
          severity: 'success',
        });
      }
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/leads');
      }, 1500);
    } catch (error) {
      console.error('Failed to save lead:', error);
      
      // Handle API error
      const errorResponse = handleApiError(error, 'Failed to save lead');
      
      // Show error notification
      setNotification({
        open: true,
        message: errorResponse.message,
        severity: 'error',
      });
      
      // If validation errors from backend, merge with frontend errors
      if (errorResponse.type === 'validation' && errorResponse.errors) {
        const mergedErrors = mergeErrors(errors, errorResponse.errors);
        setErrors(mergedErrors);
        scrollToAndHighlightErrors(mergedErrors);
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Lead' : 'Add New Lead'}
        </Typography>
      </Box>

      {/* Validation Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please fix the following {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {Object.entries(errors).slice(0, 5).map(([field, error]) => (
              <li key={field}>
                <strong>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {error}
              </li>
            ))}
            {Object.keys(errors).length > 5 && (
              <li>...and {Object.keys(errors).length - 5} more</li>
            )}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Personal Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={Boolean(errors.first_name)}
                  helperText={errors.first_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={Boolean(errors.last_name)}
                  helperText={errors.last_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  name="alternate_phone"
                  value={formData.alternate_phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Academic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Grade Applying For"
                  name="grade_applying_for"
                  value={formData.grade_applying_for}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previous School"
                  name="previous_school"
                  value={formData.previous_school}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleChange}
                  placeholder="e.g., 2026-2027"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Parent/Guardian Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Parent/Guardian Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Name"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleChange}
                  error={Boolean(errors.parent_name)}
                  helperText={errors.parent_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Phone"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleChange}
                  error={Boolean(errors.parent_phone)}
                  helperText={errors.parent_phone}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Email"
                  name="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Occupation"
                  name="parent_occupation"
                  value={formData.parent_occupation}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    name="relationship"
                    value={formData.relationship}
                    label="Relationship"
                    onChange={handleChange}
                  >
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="guardian">Guardian</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lead Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Lead Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    name="source"
                    value={formData.source}
                    label="Source"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="referral">Referral</MenuItem>
                    <MenuItem value="walk-in">Walk-in</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="social_media">Social Media</MenuItem>
                    <MenuItem value="advertisement">Advertisement</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Referral Name"
                  name="referral_name"
                  value={formData.referral_name}
                  onChange={handleChange}
                  disabled={formData.source !== 'referral'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="qualified">Qualified</MenuItem>
                    <MenuItem value="visit_scheduled">Visit Scheduled</MenuItem>
                    <MenuItem value="visited">Visited</MenuItem>
                    <MenuItem value="application_submitted">Application Submitted</MenuItem>
                    <MenuItem value="enrolled">Enrolled</MenuItem>
                    <MenuItem value="not_interested">Not Interested</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    label="Priority"
                    onChange={handleChange}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Next Follow-up Date"
                  name="next_follow_up_date"
                  type="date"
                  value={formData.next_follow_up_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Fee"
                  name="estimated_fee"
                  type="number"
                  value={formData.estimated_fee}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/leads')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {isEditMode ? 'Update Lead' : 'Create Lead'}
          </Button>
        </Box>
      </form>

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default LeadForm;
