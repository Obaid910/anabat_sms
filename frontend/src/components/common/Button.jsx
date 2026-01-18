import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({ 
  children, 
  loading = false, 
  disabled = false,
  fullWidth = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  sx = {},
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      type={type}
      sx={sx}
      {...props}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;
