import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['all'] },
  { text: 'Leads', icon: <PersonAddIcon />, path: '/leads', roles: ['all'] },
  { text: 'Students', icon: <SchoolIcon />, path: '/students', roles: ['all'] },
  { text: 'Attendance', icon: <EventNoteIcon />, path: '/attendance', roles: ['all'] },
  { text: 'Exams', icon: <AssessmentIcon />, path: '/exams', roles: ['all'] },
  { text: 'Fees', icon: <PaymentIcon />, path: '/fees', roles: ['all'] },
];

const adminMenuItems = [
  { text: 'User Management', icon: <ManageAccountsIcon />, path: '/admin/users' },
  { text: 'Branch Management', icon: <BusinessIcon />, path: '/admin/branches' },
  { text: 'Staff Management', icon: <PeopleIcon />, path: '/admin/staff' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => 
    role.name === 'Super Admin' || role.name === 'Branch Admin'
  );

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Box>
            <ListItemText
              primary="Anabat SMS"
              secondary="School Management"
              primaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      
      {/* Main Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Menu */}
      {isAdmin && (
        <>
          <Divider />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Administration
            </Typography>
          </Box>
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
