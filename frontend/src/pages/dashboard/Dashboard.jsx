import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaymentIcon from '@mui/icons-material/Payment';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={600}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 2,
            p: 1.5,
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

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: <SchoolIcon sx={{ color: 'white', fontSize: 32 }} />,
      color: 'primary.main',
    },
    {
      title: 'Active Leads',
      value: '56',
      icon: <PersonAddIcon sx={{ color: 'white', fontSize: 32 }} />,
      color: 'success.main',
    },
    {
      title: 'Staff Members',
      value: '89',
      icon: <PeopleIcon sx={{ color: 'white', fontSize: 32 }} />,
      color: 'info.main',
    },
    {
      title: 'Pending Fees',
      value: '$12,450',
      icon: <PaymentIcon sx={{ color: 'white', fontSize: 32 }} />,
      color: 'warning.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quick action buttons will appear here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
