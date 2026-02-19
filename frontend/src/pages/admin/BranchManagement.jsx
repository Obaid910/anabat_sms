import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActivateIcon,
  Cancel as DeactivateIcon,
  Settings as SettingsIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import branchService from '../../services/branchService';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact_info: {
      phone: '',
      email: '',
      fax: '',
      website: '',
    },
    status: 'active',
  });
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchService.getAllBranches();
      setBranches(response.data || []);
    } catch (error) {
      showAlert('error', 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleOpenDialog = (branch = null) => {
    if (branch) {
      setSelectedBranch(branch);
      setFormData({
        name: branch.name,
        code: branch.code,
        address: branch.address || '',
        contact_info: branch.contact_info || {
          phone: '',
          email: '',
          fax: '',
          website: '',
        },
        status: branch.status,
      });
    } else {
      setSelectedBranch(null);
      setFormData({
        name: '',
        code: '',
        address: '',
        contact_info: {
          phone: '',
          email: '',
          fax: '',
          website: '',
        },
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBranch(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedBranch) {
        await branchService.updateBranch(selectedBranch.id, formData);
        showAlert('success', 'Branch updated successfully');
      } else {
        await branchService.createBranch(formData);
        showAlert('success', 'Branch created successfully');
      }
      handleCloseDialog();
      fetchBranches();
    } catch (error) {
      showAlert('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await branchService.deleteBranch(id);
        showAlert('success', 'Branch deleted successfully');
        fetchBranches();
      } catch (error) {
        showAlert('error', error.message || 'Failed to delete branch');
      }
    }
  };

  const handleToggleStatus = async (branch) => {
    try {
      if (branch.status === 'active') {
        await branchService.deactivateBranch(branch.id);
        showAlert('success', 'Branch deactivated successfully');
      } else {
        await branchService.activateBranch(branch.id);
        showAlert('success', 'Branch activated successfully');
      }
      fetchBranches();
    } catch (error) {
      showAlert('error', error.message || 'Failed to update branch status');
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Branch Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'code',
      headerName: 'Code',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'contact_info',
      headerName: 'Contact',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value?.phone || 'N/A'}</Typography>
          <Typography variant="caption" color="textSecondary">
            {params.value?.email || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDialog(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status === 'active' ? 'Deactivate' : 'Activate'}>
            <IconButton
              size="small"
              color={params.row.status === 'active' ? 'warning' : 'success'}
              onClick={() => handleToggleStatus(params.row)}
            >
              {params.row.status === 'active' ? <DeactivateIcon /> : <ActivateIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Branch Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Branch
            </Button>
          </Box>

          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={branches}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              loading={loading}
              disableSelectionOnClick
              autoHeight
            />
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBranch ? 'Edit Branch' : 'Add New Branch'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                disabled={!!selectedBranch}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.contact_info.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, phone: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.contact_info.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, email: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fax"
                value={formData.contact_info.fax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, fax: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={formData.contact_info.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_info: { ...formData.contact_info, website: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBranch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BranchManagement;
