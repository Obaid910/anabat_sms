import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import branchService from '../../services/branchService';

const BranchSelector = ({ value, onChange, disabled = false, showAllOption = false }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchService.getActiveBranches();
      setBranches(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load branches');
      console.error('Error fetching branches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="branch-selector-label">Branch</InputLabel>
      <Select
        labelId="branch-selector-label"
        id="branch-selector"
        value={value || ''}
        label="Branch"
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
        }
      >
        {showAllOption && (
          <MenuItem value="">
            <em>All Branches</em>
          </MenuItem>
        )}
        {branches.map((branch) => (
          <MenuItem key={branch.id} value={branch.id}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography>{branch.name}</Typography>
              <Chip
                label={branch.code}
                size="small"
                sx={{ ml: 1 }}
                color="primary"
                variant="outlined"
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BranchSelector;
