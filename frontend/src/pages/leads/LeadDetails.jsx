import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import {
  fetchLead,
  changeLeadStatus,
  assignLead,
  scheduleFollowup,
  completeFollowup,
  convertToStudent,
  clearCurrentLead,
} from '../../store/slices/leadSlice';

const LeadDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLead, loading } = useSelector((state) => state.leads);

  const [tabValue, setTabValue] = useState(0);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);

  const [statusData, setStatusData] = useState({ status: '', reason: '' });
  const [followupData, setFollowupData] = useState({
    type: 'phone_call',
    scheduled_at: '',
    notes: '',
  });
  const [convertData, setConvertData] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(fetchLead(id));
    return () => {
      dispatch(clearCurrentLead());
    };
  }, [id, dispatch]);

  const handleStatusChange = async () => {
    await dispatch(changeLeadStatus({ id, ...statusData }));
    setStatusDialogOpen(false);
    dispatch(fetchLead(id));
  };

  const handleScheduleFollowup = async () => {
    await dispatch(scheduleFollowup({ id, data: followupData }));
    setFollowupDialogOpen(false);
    dispatch(fetchLead(id));
  };

  const handleConvert = async () => {
    await dispatch(convertToStudent({ id, data: convertData }));
    setConvertDialogOpen(false);
    navigate('/students');
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'info',
      contacted: 'primary',
      qualified: 'success',
      visit_scheduled: 'warning',
      visited: 'secondary',
      application_submitted: 'info',
      enrolled: 'success',
      not_interested: 'error',
      lost: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading || !currentLead) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/leads')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4">{currentLead.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Lead ID: {currentLead.id}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setStatusDialogOpen(true)}
          >
            Change Status
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFollowupDialogOpen(true)}
          >
            Schedule Follow-up
          </Button>
          {currentLead.status !== 'enrolled' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setConvertDialogOpen(true)}
            >
              Convert to Student
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Status and Priority */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip
          label={currentLead.status.replace('_', ' ')}
          color={getStatusColor(currentLead.status)}
        />
        <Chip label={`Priority: ${currentLead.priority}`} />
        {currentLead.source && <Chip label={`Source: ${currentLead.source}`} variant="outlined" />}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Overview" />
          <Tab label="Follow-ups" />
          <Tab label="Status History" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText primary="Full Name" secondary={currentLead.full_name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={currentLead.email || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Phone" secondary={currentLead.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Alternate Phone" secondary={currentLead.alternate_phone || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Date of Birth" secondary={currentLead.date_of_birth || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Gender" secondary={currentLead.gender || '-'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Parent Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Parent/Guardian Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name" secondary={currentLead.parent_name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Phone" secondary={currentLead.parent_phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={currentLead.parent_email || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Occupation" secondary={currentLead.parent_occupation || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Relationship" secondary={currentLead.relationship} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Academic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText primary="Grade Applying For" secondary={currentLead.grade_applying_for || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Previous School" secondary={currentLead.previous_school || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Academic Year" secondary={currentLead.academic_year || '-'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText primary="Address" secondary={currentLead.address || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="City" secondary={currentLead.city || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="State" secondary={currentLead.state || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Postal Code" secondary={currentLead.postal_code || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Country" secondary={currentLead.country || '-'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Lead Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Lead Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                    <Typography>{currentLead.assignedTo?.name || 'Unassigned'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Next Follow-up</Typography>
                    <Typography>{currentLead.next_follow_up_date || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Estimated Fee</Typography>
                    <Typography>{currentLead.estimated_fee ? `Rs. ${currentLead.estimated_fee}` : '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Created At</Typography>
                    <Typography>{new Date(currentLead.created_at).toLocaleDateString()}</Typography>
                  </Grid>
                  {currentLead.notes && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Notes</Typography>
                      <Typography>{currentLead.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Follow-up History</Typography>
            <Divider sx={{ mb: 2 }} />
            {currentLead.followups && currentLead.followups.length > 0 ? (
              <List>
                {currentLead.followups.map((followup) => (
                  <ListItem key={followup.id} divider>
                    <ListItemText
                      primary={`${followup.type.replace('_', ' ')} - ${followup.status}`}
                      secondary={
                        <>
                          <Typography variant="body2">{followup.notes}</Typography>
                          <Typography variant="caption">
                            {followup.scheduled_at ? `Scheduled: ${new Date(followup.scheduled_at).toLocaleString()}` : ''}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No follow-ups recorded</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Status History</Typography>
            <Divider sx={{ mb: 2 }} />
            {currentLead.statusHistory && currentLead.statusHistory.length > 0 ? (
              <List>
                {currentLead.statusHistory.map((history) => (
                  <ListItem key={history.id} divider>
                    <ListItemText
                      primary={`${history.from_status} → ${history.to_status}`}
                      secondary={
                        <>
                          <Typography variant="body2">{history.reason || 'No reason provided'}</Typography>
                          <Typography variant="caption">
                            Changed by {history.changedBy?.name} on {new Date(history.changed_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No status changes recorded</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Change Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Lead Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={statusData.status}
              label="New Status"
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
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
          <TextField
            fullWidth
            label="Reason"
            multiline
            rows={3}
            value={statusData.reason}
            onChange={(e) => setStatusData({ ...statusData, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={followupDialogOpen} onClose={() => setFollowupDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Follow-up</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={followupData.type}
              label="Type"
              onChange={(e) => setFollowupData({ ...followupData, type: e.target.value })}
            >
              <MenuItem value="phone_call">Phone Call</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="in_person">In Person</MenuItem>
              <MenuItem value="video_call">Video Call</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Scheduled Date & Time"
            type="datetime-local"
            value={followupData.scheduled_at}
            onChange={(e) => setFollowupData({ ...followupData, scheduled_at: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={followupData.notes}
            onChange={(e) => setFollowupData({ ...followupData, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowupDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleScheduleFollowup} variant="contained">Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Convert to Student Dialog */}
      <Dialog open={convertDialogOpen} onClose={() => setConvertDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Convert to Student</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will create a student account for {currentLead.full_name}
          </Typography>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={convertData.email}
            onChange={(e) => setConvertData({ ...convertData, email: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={convertData.password}
            onChange={(e) => setConvertData({ ...convertData, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConvert} variant="contained" color="success">Convert</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadDetails;
