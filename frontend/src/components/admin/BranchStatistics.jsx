import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import branchService from '../../services/branchService';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const BranchStatistics = ({ branchId }) => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (branchId) {
      fetchStatistics();
    }
  }, [branchId]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await branchService.getBranchStatistics(branchId);
      setStatistics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Branch Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Users"
            value={statistics.total_users}
            icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Active Users"
            value={statistics.active_users}
            icon={<ActiveIcon sx={{ fontSize: 40, color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Inactive Users"
            value={statistics.inactive_users}
            icon={<InactiveIcon sx={{ fontSize: 40, color: 'error.main' }} />}
            color="error"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BranchStatistics;
